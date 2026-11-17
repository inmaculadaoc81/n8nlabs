// Países para el prefijo del WhatsApp. [código ISO, nombre, prefijo]. Los de habla hispana primero (el público de la web).
export const PAISES: [string, string, string][] = [
  ["ES", "España", "34"], ["MX", "México", "52"], ["AR", "Argentina", "54"], ["CO", "Colombia", "57"], ["CL", "Chile", "56"], ["PE", "Perú", "51"],
  ["VE", "Venezuela", "58"], ["EC", "Ecuador", "593"], ["UY", "Uruguay", "598"], ["PY", "Paraguay", "595"], ["BO", "Bolivia", "591"], ["CR", "Costa Rica", "506"],
  ["PA", "Panamá", "507"], ["GT", "Guatemala", "502"], ["SV", "El Salvador", "503"], ["HN", "Honduras", "504"], ["NI", "Nicaragua", "505"],
  ["DO", "República Dominicana", "1"], ["PR", "Puerto Rico", "1"], ["CU", "Cuba", "53"],
  ["US", "Estados Unidos", "1"], ["CA", "Canadá", "1"], ["PT", "Portugal", "351"], ["FR", "Francia", "33"], ["IT", "Italia", "39"], ["DE", "Alemania", "49"],
  ["GB", "Reino Unido", "44"], ["IE", "Irlanda", "353"], ["NL", "Países Bajos", "31"], ["BE", "Bélgica", "32"], ["CH", "Suiza", "41"], ["AT", "Austria", "43"],
  ["SE", "Suecia", "46"], ["NO", "Noruega", "47"], ["DK", "Dinamarca", "45"], ["FI", "Finlandia", "358"], ["PL", "Polonia", "48"], ["RO", "Rumanía", "40"],
  ["BR", "Brasil", "55"], ["MA", "Marruecos", "212"], ["AE", "Emiratos Árabes", "971"], ["IL", "Israel", "972"], ["TR", "Turquía", "90"], ["IN", "India", "91"],
  ["AU", "Australia", "61"], ["NZ", "Nueva Zelanda", "64"], ["ZA", "Sudáfrica", "27"],
];

const ZONAS: Record<string, string> = {
  "Europe/Madrid": "ES", "Atlantic/Canary": "ES", "America/Mexico_City": "MX", "America/Bogota": "CO", "America/Lima": "PE", "America/Santiago": "CL",
  "America/Caracas": "VE", "America/Guayaquil": "EC", "America/Montevideo": "UY", "America/Asuncion": "PY", "America/La_Paz": "BO", "America/Costa_Rica": "CR",
  "America/Panama": "PA", "America/Guatemala": "GT", "America/Santo_Domingo": "DO", "America/Havana": "CU", "Europe/Lisbon": "PT", "Europe/London": "GB",
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US", "America/Los_Angeles": "US", "America/Sao_Paulo": "BR",
};

/** País probable del visitante: región del idioma del navegador (es-MX → MX) y, si no la trae, su zona horaria. */
export function paisDelNavegador(): string {
  try {
    for (const l of navigator.languages ?? [navigator.language]) {
      const r = /-([A-Za-z]{2})$/.exec(l)?.[1]?.toUpperCase();
      if (r && PAISES.some((p) => p[0] === r)) return r;
    }
    const z = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (z && ZONAS[z]) return ZONAS[z];
    if (z?.startsWith("America/Argentina")) return "AR";
  } catch { /* sin datos: se usa España */ }
  return "ES";
}

/** Si lo escrito empieza por «+» o «00» con un prefijo conocido, devuelve el país y el resto del número. El prefijo más largo gana (+593 antes que +5). */
export function detectarPais(texto: string): { pais: string; resto: string } | null {
  const t = texto.trim();
  if (!/^(\+|00)/.test(t)) return null;
  const digitos = t.replace(/^(\+|00)/, "").replace(/\D/g, "");
  const candidatos = [...PAISES].sort((a, b) => b[2].length - a[2].length);
  const hit = candidatos.find(([, , d]) => digitos.startsWith(d));
  // +1 lo comparten EE. UU., Canadá, R. Dominicana y Puerto Rico: sin más pistas se asume EE. UU. (se puede cambiar a mano)
  return hit ? { pais: hit[2] === "1" ? "US" : hit[0], resto: digitos.slice(hit[2].length) } : null;
}

/** Países de Europa: allí los importes se muestran en euros; en el resto, en dólares. */
const EUROPA = new Set(["ES", "PT", "FR", "IT", "DE", "GB", "IE", "NL", "BE", "CH", "AT", "SE", "NO", "DK", "FI", "PL", "RO"]);
export const simboloMoneda = (iso: string) => (EUROPA.has(iso) ? "€" : "$");

export const prefijoDe = (iso: string) => PAISES.find((p) => p[0] === iso)?.[2] ?? "34";
