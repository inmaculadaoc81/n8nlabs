import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Portada from "@/components/blog/Portada";
import TableOfContents from "@/components/blog/TableOfContents";
import JsonLd from "@/components/seo/JsonLd";
import { formatearFecha, getAllPosts, getPost } from "@/lib/blog";
import { absoluteUrl, BUSINESS, SITE_NAME } from "@/lib/site";

// Los artículos salen de la API de Kelatos: uno nuevo se genera la primera vez que se pide y se refresca cada minuto (sin recompilar).
// Un slug que no existe da 404.
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const url = absoluteUrl(`/blog/${post.slug}`);
  const actualizado = post.updated && post.updated !== post.date ? post.updated : null;

  return (
    <main className="blog-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: post.title,
              description: post.description,
              datePublished: post.date,
              dateModified: post.updated ?? post.date,
              inLanguage: "es",
              ...(post.image ? { image: post.image.startsWith("http") ? post.image : absoluteUrl(post.image) } : {}),
              articleSection: post.category,
              mainEntityOfPage: url,
              author: { "@type": "Organization", name: post.author, url: BUSINESS.url },
              publisher: { "@type": "Organization", name: BUSINESS.name, url: BUSINESS.url },
              ...(post.keyword ? { keywords: [post.keyword, ...post.tags].join(", ") } : {}),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
                { "@type": "ListItem", position: 3, name: post.title, item: url },
              ],
            },
          ],
        }}
      />

      <div className="blog-shell">
        {/* Índice lateral (solo pantallas anchas) */}
        <aside className="blog-toc-col">
          <TableOfContents items={post.toc} />
        </aside>

        <article className="blog-col">
          <p className="blog-breadcrumb">
            <Link href="/blog">Blog</Link>
            <span aria-hidden="true">/</span>
            <span>{post.category}</span>
          </p>
          <h1 className="blog-title">{post.title}</h1>

          <dl className="blog-meta">
            <div>
              <dt>Escrito por</dt>
              <dd>{post.author}</dd>
            </div>
            <div>
              <dt>Publicado</dt>
              <dd><time dateTime={post.date}>{formatearFecha(post.date)}</time></dd>
            </div>
            {actualizado ? (
              <div>
                <dt>Actualizado</dt>
                <dd><time dateTime={actualizado}>{formatearFecha(actualizado)}</time></dd>
              </div>
            ) : null}
            <div>
              <dt>Lectura</dt>
              <dd>{post.readingMinutes} min</dd>
            </div>
          </dl>

          <figure className="blog-hero">
            {post.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.image} alt={post.imageAlt ?? post.title} width={1200} height={675} />
            ) : (
              <Portada slug={post.slug} category={post.category} />
            )}
            {post.image && post.imageCredit ? <figcaption>Foto: {post.imageCredit}</figcaption> : null}
          </figure>

          <div className="blog-actionbar">
            <p>{post.description}</p>
            <Link href="https://cal.com/n8n-automatizaciones/30min" className="blog-pill">Reservar una llamada</Link>
          </div>

          {/* Índice plegable para móvil y tablet */}
          {post.toc.length > 0 ? (
            <details className="blog-toc-mobile">
              <summary>En este artículo</summary>
              <ol>
                {post.toc.map((i) => (
                  <li key={i.id}><a href={`#${i.id}`}>{i.text}</a></li>
                ))}
              </ol>
            </details>
          ) : null}

          <div id="inicio-articulo" />
          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.html }} />

          <aside className="blog-cta">
            <p className="blog-cta-title">¿Quieres automatizar procesos en tu empresa?</p>
            <p className="blog-cta-text">Cuéntanos tu caso en una llamada de 30 minutos y te decimos qué se puede automatizar.</p>
            <Link href="https://cal.com/n8n-automatizaciones/30min" className="blog-pill">Reservar una llamada</Link>
          </aside>
        </article>

        <div className="blog-right-col" aria-hidden="true" />
      </div>
    </main>
  );
}
