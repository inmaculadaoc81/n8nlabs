// Formulario «¿Encaja tu negocio?» (paso 3 del embudo). Los identificadores de las opciones son los mismos que valida la API de Kelatos,
// que además puntúa y clasifica (paso 4): la web no calcula nada, solo recoge las respuestas.

export type Campo = "rubro" | "facturacion" | "mensajes" | "automatizar" | "urgencia" | "inversion" | "rol";

export const PREGUNTAS: { campo: Campo; titulo: string; ayuda?: string; opciones: [string, string][] }[] = [
  {
    campo: "rubro", titulo: "¿A qué se dedica tu negocio?",
    opciones: [
      ["comercio", "Comercio / tienda online"], ["servicios", "Servicios profesionales"], ["salud", "Salud y clínicas"], ["inmobiliaria", "Inmobiliaria"],
      ["hosteleria", "Hostelería y restauración"], ["formacion", "Formación y academias"], ["agencia", "Agencia / marketing"], ["logistica", "Logística y transporte"],
      ["construccion", "Construcción y reformas"], ["otro", "Otro"],
    ],
  },
  { campo: "facturacion", titulo: "¿Cuánto facturas al mes?", ayuda: "Un dato aproximado nos basta.", opciones: [["lt5k", "Menos de 5.000 $"], ["5k_20k", "5.000 – 20.000 $"], ["20k_50k", "20.000 – 50.000 $"], ["gt50k", "Más de 50.000 $"]] },
  { campo: "mensajes", titulo: "¿Cuántos mensajes o leads recibes por semana?", opciones: [["lt20", "Menos de 20"], ["20_100", "Entre 20 y 100"], ["gt100", "Más de 100"]] },
  { campo: "automatizar", titulo: "¿Qué quieres automatizar primero?", opciones: [["whatsapp", "WhatsApp"], ["ventas", "Ventas"], ["facturacion", "Facturación"], ["otro", "Otro"]] },
  { campo: "urgencia", titulo: "¿Para cuándo lo necesitas?", opciones: [["este_mes", "Este mes"], ["1_3_meses", "En 1–3 meses"], ["explorando", "Solo estoy explorando"]] },
  { campo: "inversion", titulo: "¿Qué inversión tienes prevista?", ayuda: "Para proponerte algo que tenga sentido, no para cobrarte de más.", opciones: [["lt500", "Menos de 500 $"], ["500_1500", "500 – 1.500 $"], ["1500_5000", "1.500 – 5.000 $"], ["gt5000", "Más de 5.000 $"]] },
  { campo: "rol", titulo: "¿Cuál es tu papel en la decisión?", opciones: [["decido_yo", "Decido yo"], ["para_otro", "Lo investigo para otro"]] },
];

export type Clasificacion = "caliente" | "tibio" | "no_encaja";
