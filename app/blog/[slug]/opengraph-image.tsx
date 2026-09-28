import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { disenoPortada, hslAHex } from "@/components/blog/Portada";
import { getAllPosts, getPost } from "@/lib/blog";
import { SITE_NAME } from "@/lib/site";

// Imagen que se ve al compartir el artículo en redes y mensajería: la foto del artículo (si tiene) o un fondo de color con
// el título. Se genera al compilar la web, una por artículo.
export const alt = "Portada del artículo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#111", color: "#fff", fontSize: 64 }}>{SITE_NAME}</div>,
      size,
    );
  }
  let foto: string | null = null;
  if (post.image) {
    try {
      // La foto puede estar en la web (public/) o servirla la API de Kelatos
      const datos = post.image.startsWith("https://")
        ? Buffer.from(await (await fetch(post.image, { signal: AbortSignal.timeout(8000) })).arrayBuffer())
        : fs.readFileSync(path.join(process.cwd(), "public", post.image));
      const tipo = /\.png$/i.test(post.image) ? "image/png" : /\.webp$/i.test(post.image) ? "image/webp" : "image/jpeg";
      foto = `data:${tipo};base64,${datos.toString("base64")}`;
    } catch {
      foto = null;
    }
  }
  const { tono, tono2 } = disenoPortada(post.slug, post.category);
  const fondo = `linear-gradient(135deg, ${hslAHex(tono, 62, 20)}, ${hslAHex(tono2, 70, 42)})`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: fondo, color: "#ffffff" }}>
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img src={foto} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : null}
        {foto ? <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", background: "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.78))" }} /> : null}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 64 }}>
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, textTransform: "uppercase", opacity: 0.9 }}>{post.category}</div>
          <div style={{ display: "flex", fontSize: post.title.length > 60 ? 54 : 64, fontWeight: 700, lineHeight: 1.15 }}>{post.title}</div>
          <div style={{ display: "flex", fontSize: 28, opacity: 0.9 }}>{`${SITE_NAME} · automatizacionesn8n.com`}</div>
        </div>
      </div>
    ),
    size,
  );
}
