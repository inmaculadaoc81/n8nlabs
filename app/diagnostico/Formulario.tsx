"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PREGUNTAS, type Campo, type Clasificacion } from "@/lib/diagnostico";

const AZUL = "#2563eb";
const TOTAL = PREGUNTAS.length + 2; // datos de contacto + 7 preguntas + «qué has intentado»
const font = "var(--font-poppins)";

type Estado = "formulario" | "enviando" | "resultado";

const RESULTADOS: Record<Clasificacion, { titulo: string; texto: string; accion?: { texto: string; href: string } }> = {
  caliente: {
    titulo: "Tu negocio encaja",
    texto: "Por lo que cuentas, podemos ayudarte de verdad. Te escribimos por WhatsApp en breve para hablar contigo por teléfono. Si prefieres, reserva ya tu hueco.",
    accion: { texto: "Reservar llamada gratuita", href: "/#agendar" },
  },
  tibio: {
    titulo: "Gracias, ya tenemos tus respuestas",
    texto: "Todavía no vemos claro el momento ideal, así que no te vamos a llamar sin más. En las próximas semanas te enviaremos por WhatsApp casos reales de negocios como el tuyo para que veas qué es posible.",
  },
  no_encaja: {
    titulo: "Gracias por tu tiempo",
    texto: "Ahora mismo un servicio a medida no sería lo más rentable para ti, y preferimos decírtelo claro. Mientras tanto tienes contenido gratuito para empezar a automatizar por tu cuenta.",
    accion: { texto: "Ver contenido gratuito", href: "/blog" },
  },
};

export default function Formulario() {
  const [paso, setPaso] = useState(0); // 0 contacto · 1..7 preguntas · 8 opcional
  const [estado, setEstado] = useState<Estado>("formulario");
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [resp, setResp] = useState<Partial<Record<Campo, string>>>({});
  const [intentado, setIntentado] = useState("");
  const [trampa, setTrampa] = useState("");
  const [error, setError] = useState("");
  const [clasif, setClasif] = useState<Clasificacion | null>(null);
  const origen = useRef("");
  const tope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    origen.current = new URLSearchParams(window.location.search).get("o")?.slice(0, 60) ?? "";
  }, []);
  useEffect(() => { tope.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [paso, estado]);

  const esUltimo = paso === TOTAL - 1;
  const pregunta = paso >= 1 && paso <= PREGUNTAS.length ? PREGUNTAS[paso - 1] : null;

  function validarPaso(): string {
    if (paso === 0) {
      if (nombre.trim().length < 2) return "Escribe tu nombre.";
      if (!/^\+?\d{7,15}$/.test(whatsapp.replace(/[\s().-]/g, ""))) return "Escribe un WhatsApp válido con el prefijo del país (por ejemplo +34 600 000 000).";
    }
    if (pregunta && !resp[pregunta.campo]) return "Elige una opción para continuar.";
    return "";
  }

  async function siguiente() {
    const e = validarPaso();
    setError(e);
    if (e) return;
    if (!esUltimo) { setPaso(paso + 1); return; }
    setEstado("enviando");
    try {
      const res = await fetch("/api/diagnostico", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, whatsapp, ...resp, intentado, origen: origen.current, web: trampa }),
      });
      const j = (await res.json()) as { ok: boolean; clasificacion?: Clasificacion; error?: string };
      if (!j.ok || !j.clasificacion) throw new Error(j.error || "No se pudo enviar.");
      setClasif(j.clasificacion);
      setEstado("resultado");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar.");
      setEstado("formulario");
    }
  }

  const caja: React.CSSProperties = { width: "100%", boxSizing: "border-box", border: "1px solid #e5e7eb", borderRadius: 12, padding: "0.85rem 1rem", fontSize: "0.95rem", fontFamily: font, outline: "none", background: "#fff" };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f5f8ff 0%,#fff 60%)", padding: "9.5rem 1.25rem 5rem" }}>
      <div ref={tope} style={{ maxWidth: 620, margin: "0 auto", scrollMarginTop: 120 }}>
        {estado !== "resultado" && (
          <>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: AZUL, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: font, marginBottom: "0.8rem" }}>
              Paso {paso + 1} de {TOTAL}
            </div>
            <div style={{ height: 6, background: "#e5e7eb", borderRadius: 99, overflow: "hidden", marginBottom: "2rem" }} aria-hidden>
              <div style={{ width: `${((paso + 1) / TOTAL) * 100}%`, height: "100%", background: AZUL, transition: "width .35s ease" }} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); void siguiente(); }} noValidate>
              {/* campo trampa para robots: las personas no lo ven */}
              <input value={trampa} onChange={(e) => setTrampa(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} name="web" />

              {paso === 0 && (
                <>
                  <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.1rem)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 0.6rem", color: "#0f0f0f" }}>¿Encaja tu negocio?</h1>
                  <p style={{ color: "#666", fontFamily: font, fontSize: "0.92rem", lineHeight: 1.7, margin: "0 0 1.6rem" }}>
                    Son 8 preguntas, casi todas de elegir. Con tus respuestas te decimos si podemos ayudarte y cuál es el mejor siguiente paso.
                  </p>
                  <label style={{ display: "block", fontFamily: font, fontSize: "0.82rem", fontWeight: 600, marginBottom: 6 }}>Tu nombre</label>
                  <input style={caja} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" placeholder="Nombre y apellido" maxLength={120} />
                  <label style={{ display: "block", fontFamily: font, fontSize: "0.82rem", fontWeight: 600, margin: "1.1rem 0 6px" }}>Tu WhatsApp</label>
                  <input style={caja} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" placeholder="+34 600 000 000" maxLength={30} />
                  <p style={{ color: "#999", fontFamily: font, fontSize: "0.74rem", margin: "0.6rem 0 0" }}>Solo lo usamos para contestarte sobre esto. Nada de spam.</p>
                </>
              )}

              {pregunta && (
                <>
                  <h2 style={{ fontSize: "clamp(1.4rem,3.4vw,1.8rem)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 0.5rem", color: "#0f0f0f" }}>{pregunta.titulo}</h2>
                  {pregunta.ayuda && <p style={{ color: "#888", fontFamily: font, fontSize: "0.84rem", margin: "0 0 1.2rem" }}>{pregunta.ayuda}</p>}
                  <div role="radiogroup" aria-label={pregunta.titulo} style={{ display: "grid", gap: 10, marginTop: pregunta.ayuda ? 0 : "1.2rem", gridTemplateColumns: pregunta.opciones.length > 6 ? "repeat(auto-fit,minmax(230px,1fr))" : "1fr" }}>
                    {pregunta.opciones.map(([id, etiqueta]) => {
                      const sel = resp[pregunta.campo] === id;
                      return (
                        <button key={id} type="button" role="radio" aria-checked={sel} onClick={() => { setResp({ ...resp, [pregunta.campo]: id }); setError(""); }}
                          style={{ textAlign: "left", cursor: "pointer", padding: "0.95rem 1.1rem", borderRadius: 12, fontFamily: font, fontSize: "0.93rem", border: `1.5px solid ${sel ? AZUL : "#e5e7eb"}`, background: sel ? "#eff4ff" : "#fff", color: "#111", fontWeight: sel ? 600 : 400, display: "flex", alignItems: "center", gap: 10, transition: "all .15s" }}>
                          <span style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${sel ? AZUL : "#cbd5e1"}`, background: sel ? AZUL : "transparent", boxShadow: sel ? "inset 0 0 0 3px #fff" : "none", flexShrink: 0 }} />
                          {etiqueta}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {paso === TOTAL - 1 && (
                <>
                  <h2 style={{ fontSize: "clamp(1.4rem,3.4vw,1.8rem)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 0.5rem", color: "#0f0f0f" }}>¿Qué has intentado ya?</h2>
                  <p style={{ color: "#888", fontFamily: font, fontSize: "0.84rem", margin: "0 0 1.2rem" }}>Opcional. Nos ayuda a no proponerte lo que ya probaste.</p>
                  <textarea style={{ ...caja, minHeight: 130, resize: "vertical" }} value={intentado} onChange={(e) => setIntentado(e.target.value)} maxLength={1000} placeholder="Por ejemplo: un chatbot que no funcionó, Zapier, hacerlo a mano…" />
                </>
              )}

              {error && <p role="alert" style={{ color: "#dc2626", fontFamily: font, fontSize: "0.84rem", margin: "1rem 0 0" }}>{error}</p>}

              <div style={{ display: "flex", gap: 10, marginTop: "1.8rem", alignItems: "center" }}>
                {paso > 0 && estado === "formulario" && (
                  <button type="button" onClick={() => { setError(""); setPaso(paso - 1); }} style={{ cursor: "pointer", background: "transparent", border: "1px solid #e5e7eb", borderRadius: 999, padding: "0.8rem 1.4rem", fontFamily: font, fontSize: "0.9rem", color: "#444" }}>Atrás</button>
                )}
                <button type="submit" disabled={estado === "enviando"} style={{ cursor: estado === "enviando" ? "wait" : "pointer", background: AZUL, color: "#fff", border: "none", borderRadius: 999, padding: "0.8rem 1.8rem", fontFamily: font, fontSize: "0.92rem", fontWeight: 600, opacity: estado === "enviando" ? 0.7 : 1 }}>
                  {estado === "enviando" ? "Enviando…" : esUltimo ? "Enviar respuestas" : "Continuar"}
                </button>
              </div>
            </form>
          </>
        )}

        {estado === "resultado" && clasif && (
          <div style={{ textAlign: "center", paddingTop: "1rem" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.4rem", fontSize: 28 }} aria-hidden>✓</div>
            <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.1rem)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 0.8rem", color: "#0f0f0f" }}>{RESULTADOS[clasif].titulo}{nombre.trim() ? `, ${nombre.trim().split(/\s+/)[0]}` : ""}</h1>
            <p style={{ color: "#555", fontFamily: font, fontSize: "0.95rem", lineHeight: 1.8, margin: "0 auto 1.8rem", maxWidth: 480 }}>{RESULTADOS[clasif].texto}</p>
            {RESULTADOS[clasif].accion && (
              <Link href={RESULTADOS[clasif].accion!.href} style={{ display: "inline-block", background: AZUL, color: "#fff", borderRadius: 999, padding: "0.85rem 1.9rem", fontFamily: font, fontSize: "0.92rem", fontWeight: 600, textDecoration: "none" }}>{RESULTADOS[clasif].accion!.texto}</Link>
            )}
            <div style={{ marginTop: "1.6rem" }}>
              <Link href="/" style={{ color: "#888", fontFamily: font, fontSize: "0.82rem" }}>Volver al inicio</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
