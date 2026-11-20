// Datos públicos de la web usados por el SEO (metadatos, sitemap, datos estructurados).
// Solo contiene lo que ya aparece publicado en la propia web.

export const SITE_URL = "https://automatizacionesn8n.com";
export const SITE_NAME = "N8n Labs";
export const SITE_TITLE = "N8n Labs | Automatizaciones con n8n";
export const SITE_DESCRIPTION = "Diseñamos e implementamos automatizaciones con n8n para equipos B2B.";

export const BUSINESS = {
  name: SITE_NAME,
  url: SITE_URL,
  email: "soporte@automatizacionesn8n.com",
  telephone: "+34606806376",
  address: {
    streetAddress: "Calle Blasco de Garay 63",
    addressLocality: "Madrid",
    addressRegion: "Madrid",
    addressCountry: "ES",
  },
} as const;

/** URL absoluta a partir de una ruta relativa. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
