"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PREGUNTAS, type Campo, type Clasificacion } from "@/lib/diagnostico";
import { detectarPais, paisDelNavegador, prefijoDe, simboloMoneda } from "@/lib/paises";
import SelectorPais from "./SelectorPais";

const AZUL = "#2563eb";
const TINTA = "#0f172a";
const GRIS = "#64748b";
const LINEA = "#e2e8f0";
const font = "var(--font-poppins)";
const TOTAL = PREGUNTAS.length + 2; // contacto + 7 preguntas + «qué has intentado»

type Estado = "formulario" | "enviando" | "resultado";
type Otros = Partial<Record<"rubro" | "automatizar", string>>;

const RESULTADOS: Record<Clasificacion, { titulo: string; texto: string; accion?: { texto: string; href: string } }> = {
  caliente: {
    titulo: "Tu negocio encaja",
    texto: "Hemos recibido tus respuestas y podemos ayudarte. Te escribimos por WhatsApp en breve. Si prefieres no esperar, reserva ahora tu llamada gratuita.",
    accion: { texto: "Reservar llamada gratuita", href: "/#agendar" },
  },
  tibio: {
    titulo: "Hemos recibido tus respuestas",
    texto: "Te escribimos por WhatsApp en breve con ideas concretas para tu negocio. Si prefieres no esperar, reserva ahora una llamada gratuita.",
    accion: { texto: "Reservar llamada gratuita", href: "/#agendar" },
  },
  no_encaja: {
    titulo: "Hemos recibido tus respuestas",
    texto: "Gracias por contarnos tu caso. Te escribimos por WhatsApp con recursos para empezar. Mientras tanto, tienes contenido gratuito sobre automatización.",
    accion: { texto: "Ver contenido gratuito", href: "/blog" },
  },
};

const CSS = `
@keyframes nl-ade{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}
@keyframes nl-atr{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:none}}
@keyframes nl-arriba{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes nl-pop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
@keyframes nl-trazo{to{stroke-dashoffset:0}}
@keyframes nl-abrir{from{opacity:0;max-height:0}to{opacity:1;max-height:90px}}
.nl-ade{animation:nl-ade .38s cubic-bezier(.22,1,.36,1) both}
.nl-atr{animation:nl-atr .38s cubic-bezier(.22,1,.36,1) both}
.nl-opc{animation:nl-arriba .4s cubic-bezier(.22,1,.36,1) both}
.nl-opcion{transition:border-color .18s,background .18s,transform .18s,box-shadow .18s}
.nl-opcion:hover{border-color:#94a3b8;transform:translateY(-1px)}
.nl-opcion:active{transform:scale(.99)}
.nl-campo{transition:border-color .18s,box-shadow .18s}
.nl-campo:focus{border-color:${AZUL};box-shadow:0 0 0 4px rgba(37,99,235,.12)}
.nl-btn{transition:transform .18s,box-shadow .18s,opacity .18s}
.nl-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 20px -8px rgba(37,99,235,.7)}
.nl-btn:active:not(:disabled){transform:scale(.98)}
.nl-otro{overflow:hidden;animation:nl-abrir .3s ease both}
@media (prefers-reduced-motion:reduce){.nl-ade,.nl-atr,.nl-opc,.nl-otro{animation:none!important}.nl-opcion,.nl-btn,.nl-campo{transition:none!important}}
`;

export default function Formulario() {
  const [paso, setPaso] = useState(0); // 0 contacto · 1..7 preguntas · 8 opcional
  const [dir, setDir] = useState<"ade" | "atr">("ade");
  const [estado, setEstado] = useState<Estado>("formulario");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [pais, setPais] = useState("ES");
  const [telefono, setTelefono] = useState("");
  const [resp, setResp] = useState<Partial<Record<Campo, string>>>({});
  const [otros, setOtros] = useState<Otros>({});
  const [intentado, setIntentado] = useState("");
  const [trampa, setTrampa] = useState("");
  const [error, setError] = useState("");
  const [clasif, setClasif] = useState<Clasificacion | null>(null);
  const origen = useRef("");
  const tope = useRef<HTMLDivElement>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    origen.current = new URLSearchParams(window.location.search).get("o")?.slice(0, 60) ?? "";
    // El país del navegador solo se conoce en el cliente: se fija tras hidratar para no provocar diferencias con el HTML del servidor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPais(paisDelNavegador());
    return () => { if (temporizador.current) clearTimeout(temporizador.current); };
  }, []);
  useEffect(() => { tope.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [paso, estado]);

  const esUltimo = paso === TOTAL - 1;
  const pregunta = paso >= 1 && paso <= PREGUNTAS.length ? PREGUNTAS[paso - 1] : null;
  const moneda = simboloMoneda(pais);
  const campoOtro = pregunta && (pregunta.campo === "rubro" || pregunta.campo === "automatizar") ? pregunta.campo : null;
  const pideOtro = !!(campoOtro && resp[campoOtro] === "otro");

  /** Si pegan o escriben un número con «+52…» se detecta el país y se limpia el prefijo del campo. */
  function cambiarTelefono(v: string) {
    const d = detectarPais(v);
    if (d) { setPais(d.pais); setTelefono(d.resto); } else setTelefono(v);
    setError("");
  }
  const digitos = telefono.replace(/\D/g, "").replace(/^0+/, "");
  const whatsappCompleto = `+${prefijoDe(pais)}${digitos}`;

  function validarPaso(): string {
    if (paso === 0) {
      if (nombre.trim().length < 2) return "Escribe tu nombre.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim())) return "Escribe un correo válido.";
      if (digitos.length < 6 || digitos.length > 12) return "Revisa tu número de WhatsApp: parece incompleto.";
    }
    if (pregunta && !resp[pregunta.campo]) return "Elige una opción para continuar.";
    if (pideOtro && campoOtro && (otros[campoOtro] ?? "").trim().length < 2) return campoOtro === "rubro" ? "Cuéntanos a qué se dedica tu negocio." : "Cuéntanos qué quieres automatizar.";
    return "";
  }

  function ir(n: number, d: "ade" | "atr") {
    setDir(d);
    setPaso(n);
  }

  async function siguiente() {
    const e = validarPaso();
    setError(e);
    if (e) return;
    if (!esUltimo) { ir(paso + 1, "ade"); return; }
    setEstado("enviando");
    try {
      const res = await fetch("/api/diagnostico", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(), email: correo.trim(), whatsapp: whatsappCompleto, pais, ...resp,
          rubro_otro: otros.rubro ?? "", automatizar_otro: otros.automatizar ?? "", intentado, origen: origen.current, web: trampa,
        }),
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

  /** Elegir una opción avanza solo (salvo «Otro», que pide escribir antes). */
  function elegir(campo: Campo, id: string) {
    setResp((r) => ({ ...r, [campo]: id }));
    setError("");
    if (temporizador.current) clearTimeout(temporizador.current);
    if (id !== "otro") temporizador.current = setTimeout(() => ir(paso + 1, "ade"), 320);
  }

  const caja: React.CSSProperties = { width: "100%", boxSizing: "border-box", border: `1.5px solid ${LINEA}`, borderRadius: 14, padding: "0.9rem 1rem", fontSize: "1rem", fontFamily: font, outline: "none", background: "#fff", color: TINTA };
  const etiqueta: React.CSSProperties = { display: "block", fontFamily: font, fontSize: "0.78rem", fontWeight: 500, color: GRIS, margin: "0 0 0.4rem 0.15rem" };
  const titulo: React.CSSProperties = { fontSize: "clamp(1.55rem,4.2vw,2.05rem)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.15, margin: "0 0 0.6rem", color: TINTA };

  return (
    <main style={{ minHeight: "100vh", background: "#fff", padding: "9rem 1.25rem 4rem", position: "relative" }}>
      <style>{CSS}</style>
      {estado !== "resultado" && (
        <div style={{ position: "fixed", top: 100, left: 0, right: 0, height: 3, background: "#f1f5f9", zIndex: 90 }} aria-hidden>
          <div style={{ width: `${((paso + 1) / TOTAL) * 100}%`, height: "100%", background: AZUL, borderRadius: "0 3px 3px 0", transition: "width .5s cubic-bezier(.22,1,.36,1)" }} />
        </div>
      )}
      <div ref={tope} style={{ maxWidth: 560, margin: "0 auto", scrollMarginTop: 130 }}>
        {estado !== "resultado" && (
          <form onSubmit={(e) => { e.preventDefault(); void siguiente(); }} noValidate>
            <input value={trampa} onChange={(e) => setTrampa(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} name="web" />

            <div key={paso} className={dir === "ade" ? "nl-ade" : "nl-atr"} style={{ minHeight: 330 }}>
              <div style={{ fontSize: "0.72rem", color: GRIS, fontFamily: font, letterSpacing: "0.08em", marginBottom: "1.1rem" }}>{paso + 1} / {TOTAL}</div>

              {paso === 0 && (
                <>
                  <h1 style={titulo}>¿Encaja tu negocio?</h1>
                  <p style={{ color: GRIS, fontFamily: font, fontSize: "0.92rem", lineHeight: 1.7, margin: "0 0 1.8rem" }}>
                    Son 8 preguntas, casi todas de elegir. Te decimos si podemos ayudarte y cuál es el mejor siguiente paso.
                  </p>
                  <div style={{ display: "grid", gap: "1rem" }}>
                    <div>
                      <label htmlFor="nl-nombre" style={etiqueta}>Nombre</label>
                      <input id="nl-nombre" name="name" className="nl-campo" style={caja} value={nombre} onChange={(e) => { setNombre(e.target.value); setError(""); }} autoComplete="name" placeholder="Nombre y apellido" maxLength={120} />
                    </div>
                    <div>
                      <label htmlFor="nl-correo" style={etiqueta}>Correo electrónico</label>
                      <input id="nl-correo" name="email" type="email" inputMode="email" className="nl-campo" style={caja} value={correo} onChange={(e) => { setCorreo(e.target.value); setError(""); }} autoComplete="email" placeholder="tu@correo.com" maxLength={180} />
                    </div>
                    <div>
                      <label htmlFor="nl-tel" style={etiqueta}>WhatsApp</label>
                      <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                        <SelectorPais valor={pais} onCambiar={setPais} />
                        <input id="nl-tel" name="tel" type="tel" inputMode="tel" className="nl-campo" style={caja} value={telefono} onChange={(e) => cambiarTelefono(e.target.value)} autoComplete="tel-national" placeholder="600 000 000" maxLength={24} />
                      </div>
                      <p style={{ color: "#94a3b8", fontFamily: font, fontSize: "0.74rem", margin: "0.5rem 0 0 0.15rem" }}>Si pegas el número con el prefijo (+52…), detectamos el país solos. Solo lo usamos para contestarte sobre esto.</p>
                    </div>
                  </div>
                </>
              )}

              {pregunta && (
                <>
                  <h2 style={titulo}>{pregunta.titulo}</h2>
                  {pregunta.ayuda && <p style={{ color: GRIS, fontFamily: font, fontSize: "0.86rem", margin: "0 0 0.4rem" }}>{pregunta.ayuda}</p>}
                  <div role="radiogroup" aria-label={pregunta.titulo} style={{ display: "grid", gap: 9, marginTop: "1.3rem", gridTemplateColumns: pregunta.opciones.length > 6 ? "repeat(auto-fit,minmax(235px,1fr))" : "1fr" }}>
                    {pregunta.opciones.map(([id, texto], i) => {
                      const sel = resp[pregunta.campo] === id;
                      return (
                        <button key={id} type="button" role="radio" aria-checked={sel} className="nl-opcion nl-opc" onClick={() => elegir(pregunta.campo, id)}
                          style={{ animationDelay: `${i * 45}ms`, textAlign: "left", cursor: "pointer", padding: "0.95rem 1.1rem", borderRadius: 14, fontFamily: font, fontSize: "0.95rem", border: `1.5px solid ${sel ? AZUL : LINEA}`, background: sel ? "#eff6ff" : "#fff", color: TINTA, fontWeight: sel ? 500 : 400, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, boxShadow: sel ? "0 0 0 4px rgba(37,99,235,.08)" : "none" }}>
                          <span>{texto.replace(/\$/g, moneda)}</span>
                          <span style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, border: `1.5px solid ${sel ? AZUL : "#cbd5e1"}`, background: sel ? AZUL : "transparent", display: "flex", alignItems: "center", justifyContent: "center", animation: sel ? "nl-pop .3s ease both" : "none" }}>
                            {sel && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {pideOtro && campoOtro && (
                    <div className="nl-otro" style={{ marginTop: 12 }}>
                      <input autoFocus className="nl-campo" style={caja} value={otros[campoOtro] ?? ""} onChange={(e) => { setOtros({ ...otros, [campoOtro]: e.target.value }); setError(""); }} maxLength={200}
                        placeholder={campoOtro === "rubro" ? "¿A qué se dedica tu negocio?" : "¿Qué quieres automatizar?"} aria-label={campoOtro === "rubro" ? "Tu sector" : "Lo que quieres automatizar"} />
                    </div>
                  )}
                </>
              )}

              {paso === TOTAL - 1 && (
                <>
                  <h2 style={titulo}>¿Qué has intentado ya?</h2>
                  <p style={{ color: GRIS, fontFamily: font, fontSize: "0.86rem", margin: "0 0 1.2rem" }}>Opcional. Nos ayuda a no proponerte lo que ya probaste.</p>
                  <textarea className="nl-campo" style={{ ...caja, minHeight: 130, resize: "vertical" }} value={intentado} onChange={(e) => setIntentado(e.target.value)} maxLength={1000} placeholder="Por ejemplo: un chatbot que no funcionó, Zapier, hacerlo a mano…" />
                </>
              )}

              {error && <p role="alert" className="nl-opc" style={{ color: "#dc2626", fontFamily: font, fontSize: "0.84rem", margin: "1rem 0 0" }}>{error}</p>}

              <div style={{ display: "flex", gap: 10, marginTop: "1.8rem", alignItems: "center" }}>
                {paso > 0 && estado === "formulario" && (
                  <button type="button" onClick={() => { setError(""); ir(paso - 1, "atr"); }} className="nl-btn" style={{ cursor: "pointer", background: "transparent", border: `1.5px solid ${LINEA}`, borderRadius: 999, padding: "0.8rem 1.3rem", fontFamily: font, fontSize: "0.9rem", color: "#475569" }}>Atrás</button>
                )}
                <button type="submit" disabled={estado === "enviando"} className="nl-btn" style={{ cursor: estado === "enviando" ? "wait" : "pointer", background: AZUL, color: "#fff", border: "none", borderRadius: 999, padding: "0.85rem 1.9rem", fontFamily: font, fontSize: "0.92rem", fontWeight: 500, opacity: estado === "enviando" ? 0.7 : 1 }}>
                  {estado === "enviando" ? "Enviando…" : esUltimo ? "Enviar respuestas" : "Continuar"}
                </button>
              </div>
            </div>
          </form>
        )}

        {estado === "resultado" && clasif && (
          <div className="nl-ade" style={{ textAlign: "center", paddingTop: "1.5rem" }}>
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ margin: "0 auto 1.5rem", display: "block" }} aria-hidden>
              <circle cx="32" cy="32" r="30" fill="#eff6ff" stroke={AZUL} strokeWidth="2" />
              <polyline points="19,33 28,42 45,24" fill="none" stroke={AZUL} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" strokeDashoffset="40" style={{ animation: "nl-trazo .6s .25s ease forwards" }} />
            </svg>
            <h1 style={{ ...titulo, textAlign: "center" }}>{RESULTADOS[clasif].titulo}{nombre.trim() ? `, ${nombre.trim().split(/\s+/)[0]}` : ""}</h1>
            <p style={{ color: GRIS, fontFamily: font, fontSize: "0.95rem", lineHeight: 1.8, margin: "0 auto 1.8rem", maxWidth: 460 }}>{RESULTADOS[clasif].texto}</p>
            {RESULTADOS[clasif].accion && (
              <Link href={RESULTADOS[clasif].accion!.href} className="nl-btn" style={{ display: "inline-block", background: AZUL, color: "#fff", borderRadius: 999, padding: "0.85rem 1.9rem", fontFamily: font, fontSize: "0.92rem", fontWeight: 500, textDecoration: "none" }}>{RESULTADOS[clasif].accion!.texto}</Link>
            )}
            <div style={{ marginTop: "1.6rem" }}>
              <Link href="/" style={{ color: "#94a3b8", fontFamily: font, fontSize: "0.82rem" }}>Volver al inicio</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
