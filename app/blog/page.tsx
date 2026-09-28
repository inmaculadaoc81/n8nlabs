import type { Metadata } from "next";
import Link from "next/link";
import Portada from "@/components/blog/Portada";
import { formatearFecha, getAllPosts } from "@/lib/blog";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

const TITULO = `Blog de automatización para negocios | ${SITE_NAME}`;
const DESCRIPCION = "Casos de uso, ideas y novedades para automatizar tu negocio: Excel, CRM, WhatsApp, redes sociales, email marketing e inteligencia artificial.";

// El listado se regenera solo cada minuto con lo que haya en la API de Kelatos: publicar un artículo no necesita recompilar la web
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hayArticulos = (await getAllPosts()).length > 0;
  return {
    title: TITULO,
    description: DESCRIPCION,
    alternates: { canonical: absoluteUrl("/blog") },
    openGraph: { title: TITULO, description: DESCRIPCION, url: absoluteUrl("/blog"), siteName: SITE_NAME, locale: "es_ES", type: "website" },
    // Un índice vacío no debe indexarse
    robots: hayArticulos ? undefined : { index: false, follow: true },
  };
}

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <main className="blog-page">
      <div className="blog-index">
        <header className="blog-index-head">
          <h1 className="blog-title">Blog</h1>
          <p>{DESCRIPCION}</p>
        </header>

        {posts.length === 0 ? (
          <p className="blog-empty">Estamos preparando los primeros artículos. Vuelve pronto.</p>
        ) : (
          <ul className="blog-grid">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="blog-card">
                  <div className="blog-card-img">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.imageAlt ?? p.title} loading="lazy" width={800} height={450} />
                    ) : (
                      <Portada slug={p.slug} category={p.category} />
                    )}
                  </div>
                  <span className="blog-card-cat">{p.category}</span>
                  <h2>{p.title}</h2>
                  <p>{p.description}</p>
                  <span className="blog-card-meta">
                    {formatearFecha(p.date)} · {p.readingMinutes} min
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
