import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";

// Se regenera solo cada 5 minutos para incluir los artículos nuevos de la API
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const fijas: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/politica-de-privacidad"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terminos"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/eliminacion-de-datos"), changeFrequency: "yearly", priority: 0.2 },
  ];
  // El índice del blog solo entra en el sitemap cuando hay artículos publicados
  const blog: MetadataRoute.Sitemap = posts.length
    ? [
        { url: absoluteUrl("/blog"), lastModified: posts[0].updated ?? posts[0].date, changeFrequency: "weekly", priority: 0.7 },
        ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.updated ?? p.date, changeFrequency: "monthly" as const, priority: 0.6 })),
      ]
    : [];
  return [...fijas, ...blog];
}
