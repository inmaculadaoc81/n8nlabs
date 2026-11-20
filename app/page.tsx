"use client";

import { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { getCalApi } from "@calcom/embed-react";
import { Sparkles } from "lucide-react";
import CalBookingSection from "@/components/CalBookingSection";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
// @ts-ignore
import landTopo from "world-atlas/countries-110m.json";

function ScrollReveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(26px)", transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s` }}>
      {children}
    </div>
  );
}

const FAQS = [
  { q: "¿Cuánto tarda una automatización típica?",  a: "Depende del flujo y las integraciones. Un workflow estándar puede estar en 1 a 2 semanas; proyectos completos suelen ir de 3 a 6 semanas." },
  { q: "¿Trabajan solo con n8n?",                   a: "Sí, somos especialistas en n8n, integraciones por API y arquitectura de workflows para operación B2B." },
  { q: "¿Necesito infraestructura propia?",         a: "Podemos trabajar sobre n8n cloud o despliegues propios. Recomendamos la opción según seguridad, volumen y criticidad." },
  { q: "¿Incluye soporte y mantenimiento?",         a: "Sí. Ofrecemos soporte, monitoreo, mejoras y optimización continua." },
  { q: "¿Qué herramientas integran?",               a: "CRM, email marketing, formularios, helpdesk, Slack, Notion, Airtable, Google Sheets, ERPs y sistemas internos vía API." },
];

function FaqSection() {
  const [open, setOpen] = useState<number>(-1);
  return (
    <section style={{ background:"#0d0f17", padding:"9rem 1.5rem 8rem", contentVisibility:"auto", containIntrinsicSize:"0 600px", position:"relative", overflow:"hidden" }}>
      {/* Subtle radial glow top-center */}
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:700, height:320, background:"radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div className="faq-grid" style={{ maxWidth:1050, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:"5rem", alignItems:"start", position:"relative", zIndex:1 }}>

        {/* Left col */}
        <div className="faq-sticky" style={{ position:"sticky", top:120 }}>
          <div style={{ fontSize:"0.68rem", fontWeight:600, color:"rgba(99,153,230,0.8)", letterSpacing:"0.18em", textTransform:"uppercase" as const, marginBottom:"1rem", fontFamily:"var(--font-poppins)" }}>Soporte</div>
          <h2 style={{ fontWeight:700, fontSize:"clamp(2rem,3vw,2.8rem)", color:"#fff", letterSpacing:"-0.035em", lineHeight:1.1, margin:"0 0 1.2rem" }}>
            Preguntas<br/>
            <em style={{ fontFamily:"Times New Roman, Georgia, serif", fontStyle:"italic", fontWeight:400, color:"rgba(99,153,230,0.9)" }}>frecuentes.</em>
          </h2>
          <p style={{ fontSize:"0.85rem", color:"rgba(255,255,255,0.4)", lineHeight:1.75, margin:"0 0 2rem", fontFamily:"var(--font-poppins)", maxWidth:260 }}>
            Todo lo que necesitas saber sobre nuestro servicio de automatización B2B con n8n.
          </p>
          <a href="#contacto" style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", fontSize:"0.82rem", fontWeight:600, color:"rgba(99,153,230,0.9)", textDecoration:"none", fontFamily:"var(--font-poppins)", borderBottom:"1px solid rgba(99,153,230,0.3)", paddingBottom:"0.1rem" }}
            onMouseEnter={e => (e.currentTarget.style.color="#fff")}
            onMouseLeave={e => (e.currentTarget.style.color="rgba(99,153,230,0.9)")}
          >
            ¿Más preguntas? Escríbenos
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>

        {/* Right col — accordion */}
        <div style={{ display:"flex", flexDirection:"column" }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderTop: i === 0 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem",
                    background:"transparent", border:"none", borderBottom:"1px solid rgba(255,255,255,0.07)",
                    padding:"1.4rem 0", cursor:"pointer", textAlign:"left",
                  }}
                >
                  <span style={{ fontSize:"0.93rem", fontWeight:500, color: isOpen ? "#fff" : "rgba(255,255,255,0.75)", fontFamily:"var(--font-poppins)", lineHeight:1.4, transition:"color 0.2s" }}>
                    {faq.q}
                  </span>
                  <span style={{
                    width:26, height:26, borderRadius:"50%", flexShrink:0,
                    border:"1px solid rgba(255,255,255,0.12)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    background: isOpen ? "rgba(37,99,235,0.35)" : "transparent",
                    transition:"background 0.2s, transform 0.3s",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </span>
                </button>
                <div style={{ maxHeight: isOpen ? 180 : 0, overflow:"hidden", transition:"max-height 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
                  <p style={{ padding:"1rem 2.5rem 1.5rem 0", fontSize:"0.86rem", color:"rgba(255,255,255,0.5)", lineHeight:1.8, margin:0, fontFamily:"var(--font-poppins)" }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

function BeforeAfterSlider() {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const rafId = useRef<number>(0);

  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    setPos(Math.min(Math.max(((clientX - left) / width) * 100, 5), 95));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => updatePos(e.clientX));
    };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafId.current);
    };
  }, [updatePos]);

  return (
    <section style={{ padding: "6rem 1.5rem 7rem", background: "#fff", contentVisibility:"auto", containIntrinsicSize:"0 700px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontWeight: 600, fontSize: "clamp(1.8rem,3vw,2.8rem)", letterSpacing: "-0.03em", lineHeight: 1.15, color: "#0f0f0f", margin: 0 }}>
            De trabajo manual a<br/>
            <em style={{ fontFamily: "Times New Roman, Georgia, serif", fontStyle: "italic", fontWeight: 400, color: "#2563eb" }}>automatización inteligente.</em>
          </h2>
          <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "#888", maxWidth: 420, margin: "1rem auto 0", lineHeight: 1.7 }}>
            Arrastra para ver cómo la IA transforma procesos repetitivos en flujos automáticos escalables.
          </p>
        </div>
        <div
          ref={containerRef}
          style={{ position: "relative", height: 460, borderRadius: 24, overflow: "hidden", cursor: "ew-resize", userSelect: "none", border: "1px solid #e8eaed", boxShadow: "0 8px 48px rgba(0,0,0,0.07)" }}
          onMouseDown={(e) => { isDragging.current = true; updatePos(e.clientX); }}
          onTouchStart={(e) => updatePos(e.touches[0].clientX)}
          onTouchMove={(e) => { e.preventDefault(); updatePos(e.touches[0].clientX); }}
        >
          {/* ── BEFORE ── */}
          <div style={{ position: "absolute", inset: 0, background: "#fafaf9", clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
              <div style={{ width: "100%", maxWidth: 340 }}>
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "1.2rem 1.4rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                  <div style={{ marginBottom: "0.9rem" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Sin automatización</span>
                  </div>
                  {[
                    { text: "Seguimientos olvidados",        sub: "3 leads sin respuesta · hace 5 días" },
                    { text: "Leads en hojas de cálculo",     sub: "Excel · actualizado hace 2 días" },
                    { text: "Respuestas lentas",             sub: "Tiempo medio de respuesta: 4.2h" },
                    { text: "Tareas manuales repetitivas",   sub: "2h/día copiando datos entre apps" },
                    { text: "47 emails sin enviar",          sub: "Acumulados esta semana" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", padding: "0.5rem 0", borderBottom: i < 4 ? "1px solid #f3f4f6" : "none" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: i % 2 === 0 ? "#ef4444" : "#f97316", flexShrink: 0, marginTop: 6, display: "block" }} />
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}>{item.text}</div>
                        <div style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "0.1rem" }}>{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "0.7rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "0.6rem 0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem" }}>⚠️</span>
                  <span style={{ fontSize: "0.72rem", color: "#b91c1c", fontWeight: 500 }}>Pérdida estimada: ~12 leads/semana</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── AFTER ── */}
          <div style={{ position: "absolute", inset: 0, background: "#f8fbff", clipPath: `inset(0 0 0 ${pos}%)` }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
              <div style={{ width: "100%", maxWidth: 340 }}>
                <div style={{ background: "#fff", border: "1px solid #dbeafe", borderRadius: 16, padding: "1.2rem 1.4rem", boxShadow: "0 4px 28px rgba(37,99,235,0.09)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#2563eb", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Con N8n + IA</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "block" }} />
                      <span style={{ fontSize: "0.65rem", color: "#22c55e", fontWeight: 500 }}>En vivo</span>
                    </div>
                  </div>
                  <div style={{ marginBottom: "0.9rem", paddingBottom: "0.9rem", borderBottom: "1px solid #f0f4ff" }}>
                    <div style={{ fontSize: "0.68rem", color: "#9ca3af" }}>Leads procesados · este mes</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.45rem", marginTop: "0.2rem" }}>
                      <span style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0f0f0f", lineHeight: 1 }}>847</span>
                      <span style={{ fontSize: "0.7rem", background: "#dcfce7", color: "#16a34a", fontWeight: 600, padding: "0.1rem 0.45rem", borderRadius: 999 }}>↑ 24%</span>
                    </div>
                  </div>
                  {[
                    { text: "IA responde al instante",                  sub: "Tiempo medio: 3 segundos" },
                    { text: "Flujos automatizados",                     sub: "1,247 ejecuciones · 0 errores" },
                    { text: "CRM actualizado automáticamente",          sub: "Notion + HubSpot sincronizados" },
                    { text: "Leads organizados y calificados",          sub: "Scoring automático con GPT-4" },
                    { text: "Seguimientos y reportes automáticos",      sub: "Cada lunes a las 9:00 AM" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", padding: "0.5rem 0", borderBottom: i < 4 ? "1px solid #f0f4ff" : "none" }}>
                      <span style={{ fontSize: "0.8rem", color: "#22c55e", flexShrink: 0, marginTop: 1 }}>✓</span>
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}>{item.text}</div>
                        <div style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "0.1rem" }}>{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Labels */}
          <div style={{ position: "absolute", top: 18, left: 18, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", border: "1px solid #e5e7eb", borderRadius: 999, padding: "0.28rem 0.7rem", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", letterSpacing: "0.05em", opacity: pos > 12 ? 1 : 0, transition: "opacity 0.3s", zIndex: 10, userSelect: "none" as const }}>ANTES</div>
          <div style={{ position: "absolute", top: 18, right: 18, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", border: "1px solid #dbeafe", borderRadius: 999, padding: "0.28rem 0.7rem", fontSize: "0.7rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.05em", opacity: pos < 88 ? 1 : 0, transition: "opacity 0.3s", zIndex: 10, userSelect: "none" as const }}>DESPUÉS</div>

          {/* Divider line */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, transform: "translateX(-50%)", width: 3, background: "linear-gradient(to bottom, #ec4899, #8b5cf6, #3b82f6)", boxShadow: "0 0 18px rgba(139,92,246,0.7), 0 0 36px rgba(139,92,246,0.25)", zIndex: 20, pointerEvents: "none" }} />

          {/* Handle */}
          <div
            style={{ position: "absolute", top: "50%", left: `${pos}%`, transform: "translate(-50%, -50%)", width: 46, height: 46, borderRadius: "50%", background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.14), 0 0 0 3px rgba(139,92,246,0.18)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 21, cursor: "ew-resize" }}
            onMouseDown={(e) => { e.stopPropagation(); isDragging.current = true; }}
          >
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
              <path d="M6 1L1 6L6 11M14 1L19 6L14 11" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

const CELL = 130;
const COLS = 19;
const ROWS = 9;

type Pattern = "empty" | "diag" | "rdiag" | "cross";
function h(n: number) { return ((n * 2654435761) >>> 0); }
function pat(c: number, r: number): Pattern {
  const v = h(c * 100 + r) % 10;
  if (v < 4) return "empty";
  if (v < 7) return "diag";
  if (v < 9) return "rdiag";
  return "cross";
}
const PATS: Record<Pattern, string> = {
  empty: "",
  diag:  "repeating-linear-gradient(45deg,  rgba(0,0,0,0.055) 0px,rgba(0,0,0,0.055) 1px,transparent 1px,transparent 13px)",
  rdiag: "repeating-linear-gradient(-45deg, rgba(0,0,0,0.055) 0px,rgba(0,0,0,0.055) 1px,transparent 1px,transparent 13px)",
  cross: "repeating-linear-gradient(45deg,  rgba(0,0,0,0.04)  0px,rgba(0,0,0,0.04)  1px,transparent 1px,transparent 13px),repeating-linear-gradient(-45deg,rgba(0,0,0,0.04) 0px,rgba(0,0,0,0.04) 1px,transparent 1px,transparent 13px)",
};

// Precomputed globe dots via orthographic projection (center 20°E, 0°N)
const GLOBE_DOTS = (() => {
  function pip(poly: [number,number][], ln: number, lt: number): boolean {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi,yi] = poly[i], [xj,yj] = poly[j];
      if (((yi>lt)!==(yj>lt)) && ln<(xj-xi)*(lt-yi)/(yj-yi)+xi) inside = !inside;
    }
    return inside;
  }
  const polys: [number,number][][] = [
    // Africa — high detail
    [[-17.5,14.7],[-17,13],[-16,12],[-15,10],[-15,8],[-14,7],[-11,5],[-8,5],[-5,5],[0,5],[2,5],[4,5],[6,4],[8,4],[9,3],[10,1],[11,0],[11,-2],[12,-4],[12,-5],[12,-8],[12,-10],[12,-14],[12,-17],[13,-19],[14,-22],[15,-26],[16,-29],[16,-31],[17,-32],[18,-34],[18,-35],[19,-35],[20,-35],[22,-34],[24,-34],[26,-34],[27,-35],[28,-33],[30,-31],[32,-29],[35,-25],[36,-22],[38,-18],[39,-15],[40,-11],[41,-8],[41,-5],[42,-2],[42,1],[43,5],[44,8],[44,10],[45,10],[48,11],[51,12],[46,12],[43,11],[42,12],[40,14],[38,18],[37,22],[37,26],[37,28],[37,31],[34,31],[32,31],[30,31],[28,32],[25,32],[22,37],[20,37],[16,37],[14,37],[11,37],[9,37],[7,37],[3,37],[0,36],[-5,36],[-8,36],[-9,33],[-10,30],[-13,24],[-17,21],[-17.5,14.7]],
    // Europe — high detail
    [[-9,36],[-6,36],[0,36],[3,36],[6,36],[10,38],[12,38],[14,38],[15,38],[16,38],[18,40],[20,38],[22,37],[24,38],[26,38],[28,41],[29,42],[30,42],[32,41],[34,41],[36,41],[36,42],[34,44],[32,44],[30,46],[28,48],[26,50],[24,54],[22,55],[20,55],[18,58],[15,58],[12,58],[10,58],[8,58],[6,57],[5,58],[2,56],[0,54],[0,52],[-2,51],[-3,48],[-5,48],[-8,44],[-9,44],[-9,36]],
    // Scandinavia
    [[5,58],[8,58],[10,58],[14,58],[18,60],[24,66],[28,70],[18,70],[10,63],[5,62],[5,58]],
    // Central Asia / Turkey / Iran
    [[36,42],[45,38],[58,38],[65,32],[80,28],[80,45],[65,52],[45,48],[36,42]],
    // Russia
    [[30,48],[45,48],[65,52],[80,55],[100,60],[80,70],[55,70],[30,65],[25,57]],
    // Arabia
    [[37,30],[37,22],[42,12],[51,12],[58,23],[56,24],[55,26],[47,23],[43,18],[42,16],[36,22],[32,29]],
    // India
    [[67,23],[72,22],[75,28],[80,28],[88,22],[92,22],[87,20],[85,18],[82,14],[80,8],[76,8],[72,13]],
    // South America eastern bulge
    [[-35,5],[-35,-3],[-34,-8],[-35,-14],[-38,-18],[-43,-23],[-48,-28],[-51,-32],[-53,-34],[-55,-38],[-65,-55],[-68,-42],[-70,-20],[-75,-8],[-75,5],[-67,1],[-60,5],[-50,5],[-44,3]],
    // Britain + Ireland hint
    [[-5,50],[-5,58],[0,58],[2,56],[0,52],[-2,51],[-5,50]],
    // Greenland — large island, polar crown left side
    [[-44,60],[-42,58],[-38,56],[-30,58],[-24,60],[-20,62],[-18,65],[-18,70],[-20,76],[-25,80],[-35,83],[-45,83],[-52,80],[-57,76],[-58,72],[-57,68],[-54,65],[-52,62],[-48,60],[-44,60]],
    // Iceland
    [[-24,63],[-22,63],[-18,63],[-14,64],[-13,65],[-14,66],[-18,66],[-22,65],[-24,64],[-24,63]],
    // Norway north / Svalbard hint
    [[15,70],[20,70],[28,72],[30,74],[28,76],[20,76],[14,74],[12,72],[15,70]],
    // Canada east + Hudson Bay region
    [[-80,60],[-75,58],[-65,58],[-60,60],[-58,65],[-60,70],[-65,72],[-70,70],[-75,65],[-78,62],[-80,60]],
    // Canada west (BC + Yukon + NWT)
    [[-140,48],[-125,48],[-120,50],[-110,52],[-100,56],[-90,58],[-80,58],[-75,60],[-70,68],[-80,70],[-95,72],[-110,70],[-120,68],[-130,64],[-138,60],[-140,56],[-140,48]],
    // Alaska
    [[-168,54],[-158,54],[-150,58],[-142,60],[-138,60],[-130,56],[-130,54],[-138,52],[-148,52],[-158,52],[-164,54],[-168,54]],
  ];
  const isLand = (ln: number, lt: number) => polys.some(p => pip(p, ln, lt));
  // original: tilted view for Section 2 grid globe (untouched)
  const CX=265, CY=220, R=165, cL=18*Math.PI/180, cT=28*Math.PI/180;
  const S=2.2;
  const nbrs8 = (ln:number,lt:number) => [
    isLand(ln,lt+S),isLand(ln,lt-S),isLand(ln+S,lt),isLand(ln-S,lt),
    isLand(ln+S,lt+S),isLand(ln-S,lt+S),isLand(ln+S,lt-S),isLand(ln-S,lt-S),
  ];
  const out: {x:number;y:number;r:number;land:boolean}[] = [];
  for (let lt=-84; lt<=84; lt+=S) {
    for (let ln=-180; ln<180; ln+=S) {
      const la=lt*Math.PI/180, lo=ln*Math.PI/180;
      const c=Math.sin(cT)*Math.sin(la)+Math.cos(cT)*Math.cos(la)*Math.cos(lo-cL);
      if (c<=0.02) continue;
      const land = isLand(ln, lt);
      const n = nbrs8(ln, lt);
      const landFrac = n.filter(Boolean).length / 8;
      let baseR: number;
      if (land) { baseR = 0.85 * (0.30 + 0.70 * landFrac); }
      else { baseR = 0.38 + 0.44 * landFrac; }
      out.push({
        x: Math.round((CX+R*Math.cos(la)*Math.sin(lo-cL))*2)/2,
        y: Math.round((CY-R*(Math.cos(cT)*Math.sin(la)-Math.sin(cT)*Math.cos(la)*Math.cos(lo-cL)))*2)/2,
        r: Math.round(baseR*Math.pow(c,0.55)*10)/10,
        land,
      });
    }
  }
  return out;
})();



export default function Home() {
  const gridRef = useRef<HTMLElement>(null);
  const [gridVisible, setGridVisible] = useState(false);
  const globeCanvasRef = useRef<HTMLCanvasElement>(null);
  const globe2Ref = useRef<HTMLElement>(null);
  const [globe2Visible, setGlobe2Visible] = useState(false);
  const globeCanvas2Ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setGridVisible(true); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!gridVisible) return;
    const canvas = globeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 450, 400);
    GLOBE_DOTS.forEach(d => {
      const op = d.land ? Math.min(0.68, 0.38 + d.r * 0.13) : Math.min(0.40, 0.18 + d.r * 0.14);
      ctx.fillStyle = `rgba(37,99,235,${op})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, Math.max(0.3, d.r), 0, Math.PI * 2);
      ctx.fill();
    });
  }, [gridVisible]);

  useEffect(() => {
    const el = globe2Ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setGlobe2Visible(true); obs.disconnect(); }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!globe2Visible) return;
    const canvas = globeCanvas2Ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = 1600 * dpr;
    canvas.height = 820 * dpr;
    const S = 3.545 * dpr;
    const CX = 225, CY = 200, R = 165;
    const cL = 12 * Math.PI / 180;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    function proj(ln: number, lt: number): [number, number] | null {
      const la = lt * Math.PI / 180;
      const lo = ln * Math.PI / 180;
      if (Math.cos(la) * Math.cos(lo - cL) <= 0.02) return null;
      return [
        (CX + R * Math.cos(la) * Math.sin(lo - cL)) * S,
        (CY - R * Math.sin(la)) * S,
      ];
    }

    // Faint lat/lon grid
    ctx.strokeStyle = "rgba(37,99,235,0.07)";
    ctx.lineWidth = 0.6 * dpr;
    for (let lat = -80; lat <= 80; lat += 20) {
      ctx.beginPath(); let first = true;
      for (let lon = -180; lon <= 180; lon += 2) {
        const p = proj(lon, lat);
        if (!p) { first = true; continue; }
        first ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]);
        first = false;
      }
      ctx.stroke();
    }
    for (let lon = -180; lon < 180; lon += 20) {
      ctx.beginPath(); let first = true;
      for (let lat = -85; lat <= 85; lat += 2) {
        const p = proj(lon, lat);
        if (!p) { first = true; continue; }
        first ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]);
        first = false;
      }
      ctx.stroke();
    }

    // Clip all drawing to globe circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(CX * S, CY * S, R * S, 0, Math.PI * 2);
    ctx.clip();

    // Real land geometry from world-atlas TopoJSON
    const land = feature(landTopo as unknown as Topology, (landTopo as any).objects.countries) as any;

    ctx.lineJoin = "round";
    ctx.lineWidth = 0.7 * dpr;

    function paintRing(coords: number[][]) {
      ctx!.beginPath();
      let started = false;
      let hadHidden = false;
      for (const [ln, lt] of coords) {
        const p = proj(ln, lt);
        if (!p) { started = false; hadHidden = true; continue; }
        started ? ctx!.lineTo(p[0], p[1]) : ctx!.moveTo(p[0], p[1]);
        started = true;
      }
      if (!hadHidden) {
        ctx!.fillStyle = "rgba(37,99,235,0.09)";
        ctx!.fill();
      }
      // Subtle internal borders — coastlines and borders same style, fills merge visually
      ctx!.strokeStyle = "rgba(59,130,246,0.55)";
      ctx!.stroke();
    }

    function drawGeom(geom: any) {
      if (!geom) return;
      if (geom.type === "Polygon") {
        for (const ring of geom.coordinates) paintRing(ring as number[][]);
      } else if (geom.type === "MultiPolygon") {
        for (const poly of geom.coordinates)
          for (const ring of poly) paintRing(ring as number[][]);
      } else if (geom.type === "GeometryCollection") {
        for (const g of geom.geometries) drawGeom(g);
      }
    }

    if (land.type === "FeatureCollection") {
      for (const feat of land.features) drawGeom(feat.geometry);
    } else {
      drawGeom(land.geometry);
    }

    // Great-circle connection arcs
    const CONNECTIONS: [[number,number],[number,number]][] = [
      [[0,51],  [55,25]],   // London → Dubai
      [[-4,40], [3,6]],     // Madrid → Lagos
      [[13,52], [47,24]],   // Berlin → Riyadh
      [[-4,40], [13,52]],   // Madrid → Berlin
      [[55,25], [13,52]],   // Dubai → Berlin
    ];

    function gcPoints(p1:[number,number], p2:[number,number], n=60): [number,number][] {
      const r=(d:number)=>d*Math.PI/180, d=(r:number)=>r*180/Math.PI;
      const [lo1,la1]=[r(p1[0]),r(p1[1])], [lo2,la2]=[r(p2[0]),r(p2[1])];
      const [x1,y1,z1]=[Math.cos(la1)*Math.cos(lo1),Math.cos(la1)*Math.sin(lo1),Math.sin(la1)];
      const [x2,y2,z2]=[Math.cos(la2)*Math.cos(lo2),Math.cos(la2)*Math.sin(lo2),Math.sin(la2)];
      const pts:[number,number][] = [];
      for(let i=0;i<=n;i++){
        const t=i/n; let x=x1+t*(x2-x1),y=y1+t*(y2-y1),z=z1+t*(z2-z1);
        const l=Math.sqrt(x*x+y*y+z*z); x/=l;y/=l;z/=l;
        pts.push([d(Math.atan2(y,x)), d(Math.asin(z))]);
      }
      return pts;
    }

    ctx.lineWidth = 1.2 * dpr;
    for (const [p1, p2] of CONNECTIONS) {
      const pts = gcPoints(p1, p2);
      ctx.beginPath(); let started = false;
      for (const [ln, lt] of pts) {
        const p = proj(ln, lt);
        if (!p) { started = false; continue; }
        started ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1]);
        started = true;
      }
      ctx.strokeStyle = "rgba(37,99,235,0.30)";
      ctx.stroke();
    }

    // City dots
    const CITIES:[number,number][] = [[0,51],[55,25],[-4,40],[3,6],[13,52],[47,24]];
    for (const [ln,lt] of CITIES) {
      const p = proj(ln,lt);
      if (!p) continue;
      ctx.beginPath();
      ctx.arc(p[0],p[1], 4*dpr, 0, Math.PI*2);
      ctx.fillStyle = "rgba(37,99,235,0.90)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p[0],p[1], 8*dpr, 0, Math.PI*2);
      ctx.fillStyle = "rgba(37,99,235,0.15)";
      ctx.fill();
    }

    ctx.restore();
  }, [globe2Visible]);

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden" style={{ paddingTop: 100 }}>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes badge-pulse {
            0%,72%,100% { transform: scale(1); }
            80%         { transform: scale(1.13); }
            88%         { transform: scale(1); }
          }
          @keyframes badge-ripple {
            0%,72%  { transform: scale(1); opacity: 0; }
            73%     { opacity: 0.45; }
            100%    { transform: scale(2.1); opacity: 0; }
          }
          @keyframes ring-spark {
            from { stroke-dashoffset: 2639px; }
            to   { stroke-dashoffset: 0px; }
          }
          @keyframes ring2-cw { from { stroke-dashoffset:3330px; } to { stroke-dashoffset:0; } }
          @keyframes ring4-cw { from { stroke-dashoffset:4712px; } to { stroke-dashoffset:0; } }
          @keyframes ring5-cw { from { stroke-dashoffset:5403px; } to { stroke-dashoffset:0; } }
          @keyframes ring-enter {
            0%   { opacity:0; transform:scale(0.65); }
            60%  { opacity:1; transform:scale(1.04); }
            100% { transform:scale(1); }
          }
          @keyframes badge-enter {
            0%   { opacity:0; }
            100% { opacity:1; }
          }
          @keyframes hero-fade-in { from { opacity:0; } to { opacity:1; } }
          @keyframes hero-rise { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
          @keyframes card-float-a { 0%,100%{ transform:translateY(0px); } 50%{ transform:translateY(-6px); } }
          @keyframes card-float-b { 0%,100%{ transform:translateY(-3px); } 50%{ transform:translateY(4px); } }
          @keyframes card-float-c { 0%,100%{ transform:translateY(-5px); } 50%{ transform:translateY(2px); } }
          @keyframes conn-draw { from { stroke-dashoffset: 240; } to { stroke-dashoffset: 0; } }
          @keyframes badge-pop { 0%{opacity:0;transform:scale(0.3);} 70%{transform:scale(1.1);} 100%{opacity:1;transform:scale(1);} }
          @keyframes neuron-tl { 0%{stroke-dashoffset:115;} 70%{stroke-dashoffset:-8;} 100%{stroke-dashoffset:-8;} }
          @keyframes neuron-br { 0%{stroke-dashoffset:115;} 70%{stroke-dashoffset:-8;} 100%{stroke-dashoffset:-8;} }
          @keyframes border-trace {
            0%   { stroke-dashoffset: 200; opacity: 0; }
            6%   { opacity: 1; }
            45%  { stroke-dashoffset: 0;   opacity: 1; }
            58%  { stroke-dashoffset:-200; opacity: 0; }
            100% { stroke-dashoffset:-200; opacity: 0; }
          }
          @keyframes dot-reveal-l { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0% 0 0); } }
          @keyframes dot-reveal-r { from { clip-path: inset(0 0 0 100%); } to { clip-path: inset(0 0 0 0%); } }
          @keyframes dot-travel { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -505; } }
          [style*="card-float-a"],[style*="card-float-b"],[style*="card-float-c"] { will-change: transform; }
          [style*="badge-pulse"] { will-change: transform; }
          [style*="badge-ripple"] { will-change: transform, opacity; }
          [style*="ring-spark"],[style*="ring2-cw"],[style*="ring4-cw"],[style*="ring5-cw"] { will-change: stroke-dashoffset; }
          @keyframes globe-base-in {
            from { transform: scale(0.04); opacity: 0; }
            60%  { opacity: 1; }
            to   { transform: scale(1); opacity: 1; }
          }
          @keyframes globe-dots-in {
            from { transform: scale(0.05); opacity: 0; }
            25%  { opacity: 1; }
            to   { transform: scale(1); opacity: 1; }
          }
          @keyframes line-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
          @keyframes comet-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes node-pop {
            from { transform: scale(0); opacity: 0; }
            65%  { transform: scale(1.18); opacity: 1; }
            to   { transform: scale(1); opacity: 1; }
          }
          @media (max-width: 640px) {
            .hero-badge-label { display: none; }
            .hero-content { padding: 0 1.25rem !important; margin-top: 2rem !important; }
            .hero-cards { margin-top: 2.5rem !important; }
            .hero-card-1 { width: min(320px, calc(100vw - 2.5rem)) !important; }
            .hero-card-2 { width: min(300px, calc(100vw - 3.5rem)) !important; }
            .hero-card-3 { width: min(280px, calc(100vw - 4.5rem)) !important; }
            .hero-ctas { margin-top: 1.6rem !important; gap: 0.5rem !important; }
            .hero-ctas a { font-size: 0.84rem !important; padding: 0.72rem 1.4rem !important; }
            .hero-address { display: flex !important; }
          }
        `}} />

        {/* Rings */}
        <div className="absolute pointer-events-none" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", animation: "hero-fade-in 1.8s ease both", zIndex: 4, willChange: "transform" }}>
          <svg width={2200} height={2200} viewBox="0 0 2200 2200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="spark-glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="ring-glow-6" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="16" />
              </filter>
              <linearGradient id="ring-grad-6" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="rgba(37,99,235,0.0)" />
                <stop offset="25%"  stopColor="rgba(37,99,235,0.75)" />
                <stop offset="55%"  stopColor="rgba(56,189,248,0.85)" />
                <stop offset="80%"  stopColor="rgba(99,102,241,0.9)" />
                <stop offset="100%" stopColor="rgba(147,197,253,0.0)" />
              </linearGradient>
            </defs>

            {/* ── Static rings (tighter: 110px gap, radii 420/530/640/750/860) */}
            <circle cx={1100} cy={1100} r={420} stroke="rgba(0,0,0,0.08)" strokeWidth="1" style={{ transformOrigin:"1100px 1100px", animation:"ring-enter 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.3s both", filter:"drop-shadow(0 0 6px rgba(0,0,0,0.08))" }} />
            <circle cx={1100} cy={1100} r={530} stroke="rgba(37,99,235,0.28)" strokeWidth="1.5" style={{ transformOrigin:"1100px 1100px", animation:"ring-enter 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.5s both", filter:"drop-shadow(0 0 8px rgba(37,99,235,0.18))" }} />
            <circle cx={1100} cy={1100} r={640} stroke="rgba(0,0,0,0.05)" strokeWidth="1" style={{ transformOrigin:"1100px 1100px", animation:"ring-enter 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.7s both", filter:"drop-shadow(0 0 6px rgba(0,0,0,0.06))" }} />
            <circle cx={1100} cy={1100} r={750} stroke="rgba(37,99,235,0.18)" strokeWidth="2" style={{ transformOrigin:"1100px 1100px", animation:"ring-enter 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.9s both", filter:"drop-shadow(0 0 10px rgba(37,99,235,0.14))" }} />
            <circle cx={1100} cy={1100} r={860} stroke="rgba(0,0,0,0.03)" strokeWidth="1" style={{ transformOrigin:"1100px 1100px", animation:"ring-enter 1.2s cubic-bezier(0.34,1.56,0.64,1) 1.1s both", filter:"drop-shadow(0 0 6px rgba(0,0,0,0.05))" }} />
            {/* ── Ring 6 — gradient glow (r=980) */}
            <circle cx={1100} cy={1100} r={980} fill="none" stroke="url(#ring-grad-6)" strokeWidth="14" style={{ transformOrigin:"1100px 1100px", animation:"ring-enter 1.2s cubic-bezier(0.34,1.56,0.64,1) 1.3s both" }} />
            <circle cx={1100} cy={1100} r={980} fill="none" stroke="url(#ring-grad-6)" strokeWidth="1" style={{ transformOrigin:"1100px 1100px", animation:"ring-enter 1.2s cubic-bezier(0.34,1.56,0.64,1) 1.3s both" }} />

            {/* ── Comet sparks — static arcs + rotate() = compositor-only, zero repaint ── */}

            {/* Ring 1 (r=420, 11s) */}
            <g style={{ transformOrigin:"1100px 1100px", animation:"comet-spin 11s linear infinite", willChange:"transform" }}>
              <path d="M 1480.6 922.6 A 420 420 0 0 1 1520 1100" fill="none" stroke="rgba(99,153,230,0.18)" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M 1505.7 991.3 A 420 420 0 0 1 1520 1100" fill="none" stroke="rgba(99,153,230,0.55)" strokeWidth="2.2" strokeLinecap="round"/>
              <circle cx={1520} cy={1100} r={3} fill="white" style={{ filter:"drop-shadow(0 0 3px #fff) drop-shadow(0 0 7px #60a5fa) drop-shadow(0 0 14px rgba(37,99,235,0.9))" }}/>
            </g>

            {/* Ring 2 (r=530, 14s) */}
            <g style={{ transformOrigin:"1100px 1100px", animation:"comet-spin 14s linear infinite", willChange:"transform" }}>
              <path d="M 1580.3 876.1 A 530 530 0 0 1 1630 1100" fill="none" stroke="rgba(99,153,230,0.18)" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M 1611.9 962.8 A 530 530 0 0 1 1630 1100" fill="none" stroke="rgba(99,153,230,0.55)" strokeWidth="2"   strokeLinecap="round"/>
              <circle cx={1630} cy={1100} r={3} fill="white" style={{ filter:"drop-shadow(0 0 3px #fff) drop-shadow(0 0 7px #60a5fa) drop-shadow(0 0 14px rgba(37,99,235,0.9))" }}/>
            </g>

            {/* Ring 4 (r=750, 20s) */}
            <g style={{ transformOrigin:"1100px 1100px", animation:"comet-spin 20s linear infinite", willChange:"transform" }}>
              <path d="M 1779.7 783.0 A 750 750 0 0 1 1850 1100" fill="none" stroke="rgba(99,153,230,0.15)" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M 1824.4 905.9 A 750 750 0 0 1 1850 1100" fill="none" stroke="rgba(99,153,230,0.50)" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx={1850} cy={1100} r={2.8} fill="white" style={{ filter:"drop-shadow(0 0 3px #fff) drop-shadow(0 0 6px #60a5fa) drop-shadow(0 0 12px rgba(37,99,235,0.8))" }}/>
            </g>

            {/* Ring 5 (r=860, 26s) */}
            <g style={{ transformOrigin:"1100px 1100px", animation:"comet-spin 26s linear infinite", willChange:"transform" }}>
              <path d="M 1879.4 736.6 A 860 860 0 0 1 1960 1100" fill="none" stroke="rgba(99,153,230,0.14)" strokeWidth="1.1" strokeLinecap="round"/>
              <path d="M 1930.7 877.4 A 860 860 0 0 1 1960 1100" fill="none" stroke="rgba(99,153,230,0.48)" strokeWidth="1.7" strokeLinecap="round"/>
              <circle cx={1960} cy={1100} r={2.8} fill="white" style={{ filter:"drop-shadow(0 0 3px #fff) drop-shadow(0 0 6px #60a5fa) drop-shadow(0 0 12px rgba(37,99,235,0.8))" }}/>
            </g>

            {/* ── Badges — static with pulse/ripple + entrance ──────────────── */}
            {/* Ring 1 */}
            <g style={{ animation:"badge-enter 0.6s cubic-bezier(0.22,1,0.36,1) 1.3s both" }}>
              <circle cx={680} cy={1100} r={28} fill="none" stroke="rgba(37,99,235,0.35)" strokeWidth="1.2" style={{ transformOrigin:"680px 1100px", animation:"badge-ripple 7s ease-out 0s infinite" }} />
              <g style={{ transformOrigin:"680px 1100px", animation:"badge-pulse 7s ease-in-out 0s infinite" }}>
                <circle cx={680} cy={1100} r={28} fill="white" stroke="rgba(0,0,0,0.10)" strokeWidth="1" style={{ filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.13))" }} />
                <image href="/icons/n8n-icon.webp" x={666} y={1086} width={28} height={28} preserveAspectRatio="xMidYMid meet" />
              </g>
            </g>
            <g style={{ animation:"badge-enter 0.6s cubic-bezier(0.22,1,0.36,1) 1.45s both" }}>
              <circle cx={1464} cy={890} r={28} fill="none" stroke="rgba(37,99,235,0.35)" strokeWidth="1.2" style={{ transformOrigin:"1464px 890px", animation:"badge-ripple 7s ease-out 1.1s infinite" }} />
              <g style={{ transformOrigin:"1464px 890px", animation:"badge-pulse 7s ease-in-out 1.1s infinite" }}>
                <circle cx={1464} cy={890} r={28} fill="white" stroke="rgba(0,0,0,0.10)" strokeWidth="1" style={{ filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.13))" }} />
                <image href="/icons/googlesheetslogo.png" x={1450} y={876} width={28} height={28} preserveAspectRatio="xMidYMid meet" />
              </g>
            </g>
            <g style={{ animation:"badge-enter 0.6s cubic-bezier(0.22,1,0.36,1) 1.6s both" }}>
              <circle cx={1310} cy={1464} r={28} fill="none" stroke="rgba(37,99,235,0.35)" strokeWidth="1.2" style={{ transformOrigin:"1310px 1464px", animation:"badge-ripple 7s ease-out 2.2s infinite" }} />
              <g style={{ transformOrigin:"1310px 1464px", animation:"badge-pulse 7s ease-in-out 2.2s infinite" }}>
                <circle cx={1310} cy={1464} r={28} fill="white" stroke="rgba(0,0,0,0.10)" strokeWidth="1" style={{ filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.13))" }} />
                <image href="/icons/Zapier-logo.png" x={1296} y={1450} width={28} height={28} preserveAspectRatio="xMidYMid meet" />
              </g>
            </g>

            {/* Ring 2 */}
            <g style={{ animation:"badge-enter 0.6s cubic-bezier(0.22,1,0.36,1) 1.75s both" }}>
              <circle cx={641} cy={835} r={28} fill="none" stroke="rgba(37,99,235,0.30)" strokeWidth="1.2" style={{ transformOrigin:"641px 835px", animation:"badge-ripple 7s ease-out 3.3s infinite" }} />
              <g style={{ transformOrigin:"641px 835px", animation:"badge-pulse 7s ease-in-out 3.3s infinite" }}>
                <circle cx={641} cy={835} r={28} fill="white" stroke="rgba(0,0,0,0.08)" strokeWidth="1" style={{ filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.12))" }} />
                <image href="/icons/ChatGPT-Logo.svg.png" x={627} y={821} width={28} height={28} preserveAspectRatio="xMidYMid meet" />
              </g>
            </g>
            <g style={{ animation:"badge-enter 0.6s cubic-bezier(0.22,1,0.36,1) 1.9s both" }}>
              <circle cx={620} cy={1324} r={28} fill="none" stroke="rgba(37,99,235,0.30)" strokeWidth="1.2" style={{ transformOrigin:"620px 1324px", animation:"badge-ripple 7s ease-out 4.4s infinite" }} />
              <g style={{ transformOrigin:"620px 1324px", animation:"badge-pulse 7s ease-in-out 4.4s infinite" }}>
                <circle cx={620} cy={1324} r={28} fill="white" stroke="rgba(0,0,0,0.08)" strokeWidth="1" style={{ filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.12))" }} />
                <image href="/icons/Google_Drive_icon_(2020).svg.png" x={606} y={1310} width={28} height={28} preserveAspectRatio="xMidYMid meet" />
              </g>
            </g>
            <g style={{ animation:"badge-enter 0.6s cubic-bezier(0.22,1,0.36,1) 2.05s both" }}>
              <circle cx={1580} cy={1324} r={28} fill="none" stroke="rgba(37,99,235,0.30)" strokeWidth="1.2" style={{ transformOrigin:"1580px 1324px", animation:"badge-ripple 7s ease-out 5.5s infinite" }} />
              <g style={{ transformOrigin:"1580px 1324px", animation:"badge-pulse 7s ease-in-out 5.5s infinite" }}>
                <circle cx={1580} cy={1324} r={28} fill="white" stroke="rgba(0,0,0,0.08)" strokeWidth="1" style={{ filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.12))" }} />
                <image href="/icons/claude-logo.png" x={1566} y={1310} width={28} height={28} preserveAspectRatio="xMidYMid meet" />
              </g>
            </g>
            <g style={{ animation:"badge-enter 0.6s cubic-bezier(0.22,1,0.36,1) 2.2s both" }}>
              <circle cx={1622} cy={1008} r={28} fill="none" stroke="rgba(37,99,235,0.30)" strokeWidth="1.2" style={{ transformOrigin:"1622px 1008px", animation:"badge-ripple 7s ease-out 0.5s infinite" }} />
              <g style={{ transformOrigin:"1622px 1008px", animation:"badge-pulse 7s ease-in-out 0.5s infinite" }}>
                <circle cx={1622} cy={1008} r={28} fill="white" stroke="rgba(0,0,0,0.08)" strokeWidth="1" style={{ filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.12))" }} />
                <image href="/icons/Telegram_2019_Logo.svg.png" x={1608} y={994} width={28} height={28} preserveAspectRatio="xMidYMid meet" />
              </g>
            </g>

            {/* Ring 3 */}
            <g style={{ animation:"badge-enter 0.6s cubic-bezier(0.22,1,0.36,1) 2.35s both" }}>
              <circle cx={1654} cy={780} r={28} fill="none" stroke="rgba(37,99,235,0.25)" strokeWidth="1.2" style={{ transformOrigin:"1654px 780px", animation:"badge-ripple 7s ease-out 1.6s infinite" }} />
              <g style={{ transformOrigin:"1654px 780px", animation:"badge-pulse 7s ease-in-out 1.6s infinite" }}>
                <circle cx={1654} cy={780} r={28} fill="white" stroke="rgba(0,0,0,0.07)" strokeWidth="1" style={{ filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.11))" }} />
                <image href="/icons/Notion-logo.svg.png" x={1640} y={766} width={28} height={28} preserveAspectRatio="xMidYMid meet" />
              </g>
            </g>
            <g style={{ animation:"badge-enter 0.6s cubic-bezier(0.22,1,0.36,1) 2.5s both" }}>
              <circle cx={499} cy={881} r={28} fill="none" stroke="rgba(37,99,235,0.25)" strokeWidth="1.2" style={{ transformOrigin:"499px 881px", animation:"badge-ripple 7s ease-out 2.7s infinite" }} />
              <a href="https://wa.me/34606806376" target="_blank" rel="noopener noreferrer" style={{ cursor:"pointer" }}>
                <g style={{ transformOrigin:"499px 881px", animation:"badge-pulse 7s ease-in-out 2.7s infinite" }}>
                  <circle cx={499} cy={881} r={28} fill="white" stroke="rgba(0,0,0,0.07)" strokeWidth="1" style={{ filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.11))" }} />
                  <image href="/icons/WhatsApp_Logo_green.svg.png" x={485} y={867} width={28} height={28} preserveAspectRatio="xMidYMid meet" />
                </g>
              </a>
            </g>
            <g style={{ animation:"badge-enter 0.6s cubic-bezier(0.22,1,0.36,1) 2.65s both" }}>
              <circle cx={1730} cy={1211} r={28} fill="none" stroke="rgba(37,99,235,0.25)" strokeWidth="1.2" style={{ transformOrigin:"1730px 1211px", animation:"badge-ripple 7s ease-out 3.8s infinite" }} />
              <g style={{ transformOrigin:"1730px 1211px", animation:"badge-pulse 7s ease-in-out 3.8s infinite" }}>
                <circle cx={1730} cy={1211} r={28} fill="white" stroke="rgba(0,0,0,0.07)" strokeWidth="1" style={{ filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.11))" }} />
                <image href="/icons/shopifylogo.webp" x={1716} y={1197} width={28} height={28} preserveAspectRatio="xMidYMid meet" />
              </g>
            </g>
            <g style={{ animation:"badge-enter 0.6s cubic-bezier(0.22,1,0.36,1) 2.8s both" }}>
              <circle cx={470} cy={1211} r={28} fill="none" stroke="rgba(37,99,235,0.25)" strokeWidth="1.2" style={{ transformOrigin:"470px 1211px", animation:"badge-ripple 7s ease-out 4.9s infinite" }} />
              <g style={{ transformOrigin:"470px 1211px", animation:"badge-pulse 7s ease-in-out 4.9s infinite" }}>
                <circle cx={470} cy={1211} r={28} fill="white" stroke="rgba(0,0,0,0.07)" strokeWidth="1" style={{ filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.11))" }} />
                <image href="/icons/clickuplogo.png" x={456} y={1197} width={28} height={28} preserveAspectRatio="xMidYMid meet" />
              </g>
            </g>

            {/* Ring 4 */}
            <g style={{ animation:"badge-enter 0.6s cubic-bezier(0.22,1,0.36,1) 2.95s both" }}>
              <circle cx={350} cy={1100} r={28} fill="none" stroke="rgba(37,99,235,0.20)" strokeWidth="1.2" style={{ transformOrigin:"350px 1100px", animation:"badge-ripple 7s ease-out 0.8s infinite" }} />
              <g style={{ transformOrigin:"350px 1100px", animation:"badge-pulse 7s ease-in-out 0.8s infinite" }}>
                <clipPath id="stripe-clip"><circle cx={350} cy={1100} r={27} /></clipPath>
                <circle cx={350} cy={1100} r={28} fill="white" stroke="rgba(0,0,0,0.06)" strokeWidth="1" style={{ filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.10))" }} />
                <image href="/icons/stripelogo.png" x={322} y={1072} width={56} height={56} preserveAspectRatio="xMidYMid meet" clipPath="url(#stripe-clip)" />
              </g>
            </g>
            <g style={{ animation:"badge-enter 0.6s cubic-bezier(0.22,1,0.36,1) 3.1s both" }}>
              <circle cx={1850} cy={1100} r={28} fill="none" stroke="rgba(37,99,235,0.20)" strokeWidth="1.2" style={{ transformOrigin:"1850px 1100px", animation:"badge-ripple 7s ease-out 1.9s infinite" }} />
              <g style={{ transformOrigin:"1850px 1100px", animation:"badge-pulse 7s ease-in-out 1.9s infinite" }}>
                <circle cx={1850} cy={1100} r={28} fill="white" stroke="rgba(0,0,0,0.06)" strokeWidth="1" style={{ filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.10))" }} />
                <image href="/icons/metalogo.jpg" x={1836} y={1086} width={28} height={28} preserveAspectRatio="xMidYMid meet" />
              </g>
            </g>
          </svg>
        </div>


        {/* Glow behind content */}

        {/* Content */}
        <div
          className="relative z-10 flex flex-col items-center text-center hero-content"
          style={{ padding: "0 1.5rem", marginTop: "-32px" }}
        >
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "999px", padding: "0.32rem 1rem 0.32rem 0.38rem", marginBottom: "1.8rem", boxShadow: "0 2px 12px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.9) inset", animation: "hero-rise 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s both" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(37,99,235,0.4)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2 C12 2 13.2 8.8 16 12 C13.2 15.2 12 22 12 22 C12 22 10.8 15.2 8 12 C10.8 8.8 12 2 12 2Z" fill="white"/><path d="M2 12 C2 12 8.8 10.8 12 8 C15.2 10.8 22 12 22 12 C22 12 15.2 13.2 12 16 C8.8 13.2 2 12 2 12Z" fill="white"/></svg>
            </div>
            <span style={{ fontSize: "0.79rem", color: "#374151", fontWeight: 500, fontFamily: "var(--font-poppins)", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>Automatiza tu negocio con IA</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontWeight: 600,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            color: "#0f0f0f",
            margin: 0,
            fontSize: "clamp(1.75rem, 3.4vw, 3.2rem)",
            maxWidth: "780px",
            fontFamily: "var(--font-poppins)",
            animation: "hero-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.35s both",
          }}>
            Automatiza tu negocio<br />
            <em style={{ fontFamily: "Times New Roman, Georgia, serif", fontStyle: "italic", fontWeight: 400, color: "#2563eb" }}>
              con Inteligencia Artificial.
            </em>
          </h1>

          {/* Subtitle */}
          <p style={{
            marginTop: "1.6rem",
            fontSize: "1rem",
            color: "#888",
            lineHeight: 1.7,
            maxWidth: "460px",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            fontFamily: "var(--font-poppins)",
            animation: "hero-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.55s both",
          }}>
            Diseñamos e implementamos automatizaciones inteligentes con n8n para que tu empresa trabaje sola.
          </p>

          {/* CTAs */}
          <div className="hero-ctas" style={{ display: "flex", gap: "0.65rem", marginTop: "2.2rem", flexWrap: "wrap", justifyContent: "center", animation: "hero-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.75s both" }}>
            <a
              href="https://cal.com/n8n-automatizaciones/30min"
              target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontWeight: 600, fontSize: "0.88rem", padding: "0.82rem 1.75rem", borderRadius: "999px", textDecoration: "none", letterSpacing: "-0.01em", fontFamily: "var(--font-poppins)", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "0 4px 20px rgba(37,99,235,0.4), 0 1px 0 rgba(255,255,255,0.22) inset", transition: "box-shadow 0.15s, transform 0.15s", cursor:"pointer" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(37,99,235,0.55), 0 1px 0 rgba(255,255,255,0.22) inset"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(37,99,235,0.4), 0 1px 0 rgba(255,255,255,0.22) inset"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Agendar una cita
            </a>
            <a
              href="https://wa.me/34606806376"
              target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: "rgba(255,255,255,0.92)", color: "#0f0f0f", fontWeight: 600, fontSize: "0.88rem", padding: "0.82rem 1.5rem", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.6)", textDecoration: "none", letterSpacing: "-0.01em", fontFamily: "var(--font-poppins)", boxShadow: "0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", transition: "transform 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 18px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center", width:8, height:8, marginRight:2 }}>
                <span style={{ position:"absolute", width:14, height:14, borderRadius:"50%", background:"rgba(34,197,94,0.25)", animation:"ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
                <span style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} />
              </span>
              +34 606 806 376
            </a>
            <a
              href="tel:+34910054012"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.92)", color: "#0f0f0f", fontWeight: 600, fontSize: "0.88rem", padding: "0.82rem 1.5rem", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.6)", textDecoration: "none", letterSpacing: "-0.01em", fontFamily: "var(--font-poppins)", boxShadow: "0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", transition: "transform 0.15s, box-shadow 0.15s", whiteSpace:"nowrap" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 18px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)"; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              +34 910 05 40 12
            </a>
          </div>
          {/* Address button */}
          <div className="hero-address" style={{ marginTop:"1rem", display:"flex", justifyContent:"center", animation:"hero-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.75s both" }}>
            <a href="#ubicacion" onClick={e => { e.preventDefault(); document.getElementById("ubicacion")?.scrollIntoView({ behavior:"smooth" }); }}
              style={{ display:"inline-flex", alignItems:"center", gap:"0.55rem", fontSize:"0.84rem", color:"#0f0f0f", textDecoration:"none", fontFamily:"var(--font-poppins)", cursor:"pointer", background:"#fff", padding:"0.82rem 1.2rem", borderRadius:999, border:"1px solid rgba(0,0,0,0.1)", boxShadow:"0 2px 12px rgba(0,0,0,0.12)", transition:"box-shadow 0.15s", whiteSpace:"nowrap" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow="0 4px 18px rgba(0,0,0,0.16)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow="0 2px 12px rgba(0,0,0,0.12)"; }}>
              {/* Maps circle + pin */}
              <div style={{ width:28, height:28, borderRadius:"50%", background:"#e8f0e8", border:"1.5px solid #c8d8c8", flexShrink:0, position:"relative", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                {/* Simplified map lines */}
                <svg width="28" height="28" viewBox="0 0 28 28" style={{ position:"absolute", inset:0 }}>
                  <rect width="28" height="28" fill="#eaf1ea"/>
                  <line x1="0" y1="14" x2="28" y2="14" stroke="#c5d8c5" strokeWidth="2.5"/>
                  <line x1="14" y1="0" x2="14" y2="28" stroke="#c5d8c5" strokeWidth="1.5"/>
                  <rect x="4" y="6" width="8" height="5" rx="1" fill="#d4e5d4"/>
                  <rect x="16" y="17" width="7" height="5" rx="1" fill="#d4e5d4"/>
                  <rect x="17" y="7" width="6" height="4" rx="1" fill="#d4e5d4"/>
                </svg>
                {/* Pin */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ position:"relative", zIndex:1, marginBottom:2 }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
                  <circle cx="12" cy="9" r="2.5" fill="#fff"/>
                </svg>
              </div>
              <span style={{ letterSpacing:"-0.01em", fontWeight:500 }}>Calle Blasco de Garay 63, Local 2 · Madrid</span>
            </a>
          </div>

          {/* Floating activity cards */}
          <div className="hero-cards" style={{ marginTop: "3.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0", animation: "hero-rise 1s cubic-bezier(0.22,1,0.36,1) 1s both" }}>

            {/* Card 1 */}
            <div className="hero-card-1" style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "14px", padding: "0.75rem 1rem", width: "320px", boxShadow: "0 8px 32px rgba(0,0,0,0.09), 0 1px 0 rgba(255,255,255,0.9) inset", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: "0.75rem", zIndex: 3, position: "relative", animation: "card-float-a 4s ease-in-out infinite", willChange: "transform" }}>
              <div style={{ width: 36, height: 36, borderRadius: "12px", background: "#fff", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <img src="/icons/n8n-icon.webp" width={22} height={22} style={{ objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0f0f0f", fontFamily: "var(--font-poppins)", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Flujo ejecutado <span style={{ fontWeight: 400, color: "#6b7280" }}>· 847 leads procesados</span>
                </div>
                <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.15rem", fontFamily: "var(--font-poppins)" }}>hace 30s · HubSpot → Notion</div>
              </div>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 2px rgba(34,197,94,0.2)", flexShrink: 0 }} />
            </div>

            {/* Card 2 */}
            <div className="hero-card-2" style={{ background: "rgba(255,255,255,0.88)", border: "1px solid rgba(0,0,0,0.065)", borderRadius: "14px", padding: "0.75rem 1rem", width: "300px", boxShadow: "0 6px 24px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.9) inset", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: "0.75rem", zIndex: 2, position: "relative", marginTop: "-8px", animation: "card-float-b 5s ease-in-out 0.6s infinite", willChange: "transform" }}>
              <div style={{ width: 36, height: 36, borderRadius: "12px", background: "#fff", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <img src="/icons/ChatGPT-Logo.svg.png" width={22} height={22} style={{ objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0f0f0f", fontFamily: "var(--font-poppins)", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  GPT-4 <span style={{ fontWeight: 400, color: "#6b7280" }}>· Correo generado y enviado</span>
                </div>
                <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.15rem", fontFamily: "var(--font-poppins)" }}>hace 2 min · cliente@empresa.com</div>
              </div>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 2px rgba(34,197,94,0.2)", flexShrink: 0 }} />
            </div>

            {/* Card 3 */}
            <div className="hero-card-3" style={{ background: "rgba(255,255,255,0.82)", border: "1px solid rgba(0,0,0,0.055)", borderRadius: "14px", padding: "0.75rem 1rem", width: "280px", boxShadow: "0 4px 16px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,0.9) inset", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: "0.75rem", zIndex: 1, position: "relative", marginTop: "-8px", animation: "card-float-c 4.5s ease-in-out 1.2s infinite", willChange: "transform" }}>
              <div style={{ width: 36, height: 36, borderRadius: "12px", background: "#fff", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <img src="/icons/Google_Drive_icon_(2020).svg.png" width={20} height={20} style={{ objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0f0f0f", fontFamily: "var(--font-poppins)", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Sync <span style={{ fontWeight: 400, color: "#6b7280" }}>· 4.201 filas actualizadas</span>
                </div>
                <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.15rem", fontFamily: "var(--font-poppins)" }}>hace 5 min · Sheets → Airtable</div>
              </div>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 0 2px rgba(245,158,11,0.2)", flexShrink: 0 }} />
            </div>

          </div>
        </div>
        {/* Fade bottom → second section */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "240px", background: "linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(255,255,255,0.9) 70%, white 100%)", borderRadius: "50% 50% 0 0 / 36px 36px 0 0", zIndex: 20 }} />
      </section>

      {/* ── SECTION 3 — Video demo ── */}
      <section id="servicios" className="s2-section" style={{ padding:"0 1.5rem 0", background:"#fff", position:"relative", overflow:"hidden", contentVisibility:"auto", containIntrinsicSize:"0 900px" }}>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes s2-rect-in {
            from { opacity: 0; transform: skewY(35deg) translateY(40px); }
            to   { opacity: 1; transform: skewY(35deg) translateY(0); }
          }
          @keyframes s2-rect-in-r {
            from { opacity: 0; transform: skewY(-35deg) translateY(40px); }
            to   { opacity: 1; transform: skewY(-35deg) translateY(0); }
          }
          @keyframes s2-card-in {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes s2-line-draw {
            from { stroke-dashoffset: 400; opacity: 0; }
            to   { stroke-dashoffset: 0; opacity: 1; }
          }
          .s2-rect-l { animation: s2-rect-in   0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
          .s2-rect-r { animation: s2-rect-in-r 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
          .s2-card:nth-child(1) { animation: s2-card-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
          .s2-card:nth-child(2) { animation: s2-card-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.38s both; }
          .s2-card:nth-child(3) { animation: s2-card-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.51s both; }
          @media (max-width: 640px) {
            .s2-cards     { flex-direction: column !important; height: auto !important; gap: 12px !important; }
            .s2-card      { min-height: 260px !important; }
            .s2-lines     { display: none !important; }
            .s2-dots      { display: none !important; }
            .s2-connector { display: none !important; }
            .s2-rect-l { left: -80px !important; width: 200px !important; height: 300px !important; top: 10% !important; }
            .s2-rect-r { right: -80px !important; width: 200px !important; height: 300px !important; top: 10% !important; }
            .s2-section   { padding: 0 1rem !important; }
            .s2-wrap      { margin-top: 1.8rem !important; }
          }
        `}} />

        {/* Background rectangles — flanking the video */}
        <div className="s2-rect-l" style={{ position:"absolute", left:"calc(50% - 720px)", top:"-9%", width:480, height:650, borderRadius:60, background:"radial-gradient(ellipse at 60% 40%, rgba(37,99,235,0.16) 0%, rgba(59,130,246,0.10) 45%, rgba(255,255,255,0) 80%)", border:"1.5px solid rgba(37,99,235,0.65)", pointerEvents:"none", zIndex:0, transform:"skewY(35deg)", transformOrigin:"left top", WebkitMaskImage:"linear-gradient(to right, transparent 0%, black 22%), linear-gradient(to top, transparent 0%, black 18%), radial-gradient(ellipse 90% 65% at 0% 0%, transparent 0%, transparent 30%, black 80%)", maskImage:"linear-gradient(to right, transparent 0%, black 22%), linear-gradient(to top, transparent 0%, black 18%), radial-gradient(ellipse 90% 65% at 0% 0%, transparent 0%, transparent 30%, black 80%)", WebkitMaskComposite:"destination-in, destination-in", maskComposite:"intersect, intersect" }} />
        <div className="s2-rect-r" style={{ position:"absolute", right:"calc(50% - 720px)", top:"-9%", width:480, height:650, borderRadius:60, background:"radial-gradient(ellipse at 40% 40%, rgba(37,99,235,0.16) 0%, rgba(59,130,246,0.10) 45%, rgba(255,255,255,0) 80%)", border:"1.5px solid rgba(37,99,235,0.65)", pointerEvents:"none", zIndex:0, transform:"skewY(-35deg)", transformOrigin:"right top", WebkitMaskImage:"linear-gradient(to left, transparent 0%, black 22%), linear-gradient(to top, transparent 0%, black 18%), radial-gradient(ellipse 90% 65% at 100% 0%, transparent 0%, transparent 30%, black 80%)", maskImage:"linear-gradient(to left, transparent 0%, black 22%), linear-gradient(to top, transparent 0%, black 18%), radial-gradient(ellipse 90% 65% at 100% 0%, transparent 0%, transparent 30%, black 80%)", WebkitMaskComposite:"destination-in, destination-in", maskComposite:"intersect, intersect" }} />

        <div style={{ maxWidth:1200, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1, paddingTop:"1.2rem" }}>
          <ScrollReveal delay={0.05}>
          <div style={{ display:"inline-flex", alignItems:"center", border:"1px solid #e5e7eb", borderRadius:999, padding:"0.28rem 0.9rem", marginBottom:"1.6rem", fontSize:"0.75rem", color:"#555", background:"#fff" }}>
            Mira cómo funciona
          </div>
          <h2 style={{ fontWeight:600, fontSize:"clamp(1.8rem,3vw,2.8rem)", letterSpacing:"-0.035em", lineHeight:1.1, color:"#0f0f0f", margin:"0 0 1.1rem" }}>
            Tu operación, sin fricción.<br/>
            <em style={{ fontFamily:"Times New Roman, Georgia, serif", fontStyle:"italic", fontWeight:400, color:"#2563eb" }}>Automatizada con IA.</em>
          </h2>
          <p style={{ fontSize:"0.95rem", color:"#888", maxWidth:440, margin:"0 auto 2rem", lineHeight:1.7 }}>
            Conectamos tus herramientas, eliminamos tareas repetitivas y liberamos a tu equipo para lo que realmente importa.
          </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}><div style={{ display:"flex", gap:"0.75rem", justifyContent:"center", marginBottom:0, flexWrap:"wrap" }}>
            <a href="https://cal.com/n8n-automatizaciones/30min" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"#2563eb", color:"#fff", fontWeight:600, fontSize:"0.88rem", padding:"0.78rem 1.6rem", borderRadius:999, textDecoration:"none", letterSpacing:"-0.01em", boxShadow:"0 4px 18px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
              Empezar ahora
            </a>
            <a href="#servicios" style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", background:"#fff", color:"#0f0f0f", fontWeight:500, fontSize:"0.88rem", padding:"0.78rem 1.6rem", borderRadius:999, border:"1px solid #e5e7eb", textDecoration:"none", letterSpacing:"-0.01em", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
              Ver servicios
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div></ScrollReveal>

          <div className="s2-connector" style={{ position:"relative", height:"4.5rem", width:"100%", pointerEvents:"none" }}>
            <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", overflow:"visible" }} viewBox="0 0 1200 72" preserveAspectRatio="none">
              <path d="M 523 0 L 523 14 Q 523 30 503 30 L 300 30 Q 280 30 280 50 L 280 72" fill="none" stroke="rgba(99,153,230,0.6)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M 688 0 L 688 14 Q 688 30 708 30 L 1080 30 Q 1100 30 1100 50 L 1100 72" fill="none" stroke="rgba(99,153,230,0.45)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <ScrollReveal delay={0.2}>
          <div className="s2-wrap" style={{ position:"relative", margin:"0 0 3rem" }}>
          <svg className="s2-lines" style={{ position:"absolute", right:"100%", top:0, width:"22vw", height:"100%", overflow:"visible", pointerEvents:"none", zIndex:1 }} viewBox="0 0 260 400" preserveAspectRatio="none">
            <line x1="260" y1="170" x2="60" y2="170" stroke="rgba(99,153,230,0.6)" strokeWidth="0.7" strokeLinecap="round"/>
            <line x1="260" y1="230" x2="120" y2="230" stroke="rgba(99,153,230,0.45)" strokeWidth="0.7" strokeLinecap="round"/>
          </svg>
          <svg className="s2-lines" style={{ position:"absolute", left:"100%", top:0, width:"40vw", height:"100%", overflow:"visible", pointerEvents:"none", zIndex:1 }} viewBox="0 0 400 400" preserveAspectRatio="none">
            <path d="M 0 200 L 42 200 Q 55 200 55 187 L 55 -67 Q 55 -80 68 -80 L 400 -80" fill="none" stroke="rgba(99,153,230,0.65)" strokeWidth="0.7" strokeLinecap="round"/>
          </svg>
          <div className="s2-dots" style={{ position:"absolute", left:-90, top:-80, width:380, height:520, backgroundImage:"radial-gradient(circle, rgba(99,102,241,0.55) 2px, transparent 2px)", backgroundSize:"14px 14px", WebkitMaskImage:"radial-gradient(circle at 50% 50%, black 0%, black 35%, transparent 70%)", maskImage:"radial-gradient(circle at 50% 50%, black 0%, black 35%, transparent 70%)", pointerEvents:"none", zIndex:1 }} />
          <div className="s2-dots" style={{ position:"absolute", right:-90, top:-80, width:380, height:520, backgroundImage:"radial-gradient(circle, rgba(99,102,241,0.55) 2px, transparent 2px)", backgroundSize:"14px 14px", WebkitMaskImage:"radial-gradient(circle at 50% 50%, black 0%, black 35%, transparent 70%)", maskImage:"radial-gradient(circle at 50% 50%, black 0%, black 35%, transparent 70%)", pointerEvents:"none", zIndex:1 }} />
          <div className="s2-cards" style={{ display:"flex", gap:16, height:420, position:"relative", zIndex:2, textAlign:"left" }}>
              {/* Card 1 — Integraciones entre herramientas */}
              <div className="s2-card" style={{ flex:1, background:"white", border:"1px solid #e8eaed", borderRadius:18, padding:"0.7rem 0.7rem 0.9rem", display:"flex", flexDirection:"column", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
                <div style={{ flex:1, marginBottom:"0.65rem", borderRadius:10, position:"relative", overflow:"hidden", minHeight:115 }}>
                  <img src="/cards/CARD1.png" alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", borderRadius:10 }} />
                </div>
                <div style={{ padding:"0.8rem 0.7rem 0.5rem", display:"flex", flexDirection:"column", gap:"0.35rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.45rem" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 10h16M4 14h8"/><circle cx="17" cy="17" r="3"/><path d="m21 21-1.5-1.5"/></svg>
                    <span style={{ fontSize:"0.95rem", fontWeight:600, color:"#0f0f0f", fontFamily:"var(--font-poppins)" }}>Integraciones entre herramientas</span>
                  </div>
                  <p style={{ fontSize:"0.75rem", color:"#888", margin:0, lineHeight:1.5, fontFamily:"var(--font-poppins)" }}>Conectamos tus apps por API para que los datos fluyan solos: CRM, email, Slack, Notion y ERPs.</p>
                </div>
              </div>

              {/* Card 2 — Flujo centralizado */}
              <div className="s2-card" style={{ flex:1, background:"white", border:"1px solid #e8eaed", borderRadius:18, padding:"0.7rem 0.7rem 0.9rem", display:"flex", flexDirection:"column", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
                <div style={{ flex:1, marginBottom:"0.65rem", borderRadius:10, position:"relative", overflow:"hidden", minHeight:115 }}>
                  <img src="/cards/CARD2.png" alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", borderRadius:10 }} />
                </div>
                <div style={{ padding:"0.5rem 0.4rem 0.3rem", display:"flex", flexDirection:"column", gap:"0.3rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.45rem" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span style={{ fontSize:"0.95rem", fontWeight:600, color:"#0f0f0f", fontFamily:"var(--font-poppins)" }}>Flujo centralizado en tu proyecto</span>
                  </div>
                  <p style={{ fontSize:"0.75rem", color:"#888", margin:0, lineHeight:1.5, fontFamily:"var(--font-poppins)" }}>Sin fricciones ni demoras. Colaboramos contigo desde el primer día para que cada proceso fluya.</p>
                </div>
              </div>

              {/* Card 3 — Dashboards y reportes */}
              <div className="s2-card" style={{ flex:1, background:"white", border:"1px solid #e8eaed", borderRadius:18, padding:"0.7rem 0.7rem 0.9rem", display:"flex", flexDirection:"column", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
                <div style={{ flex:1, marginBottom:"0.65rem", borderRadius:10, position:"relative", overflow:"hidden", minHeight:115 }}>
                  <img src="/cards/CARD3.png" alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", borderRadius:10 }} />
                </div>
                <div style={{ padding:"0.5rem 0.4rem 0.3rem", display:"flex", flexDirection:"column", gap:"0.3rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.45rem" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    <span style={{ fontSize:"0.95rem", fontWeight:600, color:"#0f0f0f", fontFamily:"var(--font-poppins)" }}>Dashboards y reportes</span>
                  </div>
                  <p style={{ fontSize:"0.75rem", color:"#888", margin:0, lineHeight:1.5, fontFamily:"var(--font-poppins)" }}>Reportes automáticos, alertas de desviación y resúmenes diarios a email o Slack.</p>
                </div>
              </div>
          </div>
          </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── GLOBE SECTION — integrations ─────────────────────────────────── */}
      <section ref={globe2Ref} style={{ background: "#ffffff", padding: "4rem 0 0", overflowX: "clip" as any, overflowY: "visible", position: "relative", textAlign: "center",
        backgroundImage: `
          repeating-linear-gradient(45deg, rgba(37,99,235,0.035) 0, rgba(37,99,235,0.035) 1px, transparent 0, transparent 50%),
          repeating-linear-gradient(-45deg, rgba(37,99,235,0.035) 0, rgba(37,99,235,0.035) 1px, transparent 0, transparent 50%)
        `,
        backgroundSize: "28px 28px",
      }}>

        {/* Soft radial glow from globe center */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
          background:"radial-gradient(ellipse 70% 60% at 50% 100%, rgba(37,99,235,0.07) 0%, transparent 70%)" }} />

        {/* Illuminated line segments — glowing portions of the crosshatch lines */}

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes g2-globe-in { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
          @keyframes g2-card-in { from { opacity:0; transform:translateY(18px) scale(0.94); } to { opacity:1; transform:translateY(0) scale(1); } }
          @keyframes g2-float-a { 0%,100%{ transform:translateY(0px); } 50%{ transform:translateY(-7px); } }
          @keyframes g2-float-b { 0%,100%{ transform:translateY(-4px); } 50%{ transform:translateY(5px); } }
          @keyframes g2-float-c { 0%,100%{ transform:translateY(-2px); } 50%{ transform:translateY(6px); } }
        `}} />

        {/* Header */}
        <div className="globe-header" style={{ maxWidth: 640, margin: "0 auto 2.5rem", padding: "0 1.5rem", position: "relative", zIndex: 2 }}>
          <ScrollReveal delay={0.05}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"0.45rem", fontSize:"0.68rem", fontWeight:600, color:"#2563eb", letterSpacing:"0.15em", textTransform:"uppercase" as const, marginBottom:"1rem", fontFamily:"var(--font-poppins)", border:"1px solid rgba(37,99,235,0.2)", padding:"0.35rem 0.8rem", borderRadius:999, background:"rgba(37,99,235,0.05)" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              Integraciones
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 style={{ fontWeight:700, fontSize:"clamp(1.9rem,3.5vw,3rem)", letterSpacing:"-0.035em", lineHeight:1.1, color:"#0f0f0f", margin:"0 0 1.1rem", fontFamily:"var(--font-inter)" }}>
              Conectamos las herramientas{" "}
              <em style={{ fontFamily:"Times New Roman, Georgia, serif", fontStyle:"italic", fontWeight:400, color:"#2563eb" }}>que ya usas.</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p style={{ fontSize:"0.92rem", color:"#666", lineHeight:1.75, margin:0, fontFamily:"var(--font-poppins)" }}>
              n8n conecta más de 400 herramientas. Automatizamos los flujos que ya tienes, sin reemplazar tu stack.
            </p>
          </ScrollReveal>
        </div>

        {/* Globe — scale=3.545 → diameter=1170px
            CX_display=939, CY_display=780, R_display=585
            Canvas left = 50% - 939px centers the globe                      */}
        <div style={{ position: "relative", height: 620, overflowY: "clip" as any, overflowX: "visible" }}>
          <canvas
            ref={globeCanvas2Ref}
            width={1600} height={820}
            style={{
              position: "absolute",
              left: "calc(50% - 798px)",
              top: -60,
              width: 1600, height: 820,
              display: "block",
              opacity: globe2Visible ? 1 : 0,
              animation: globe2Visible ? "g2-globe-in 1.1s cubic-bezier(0.22,1,0.36,1) 0.1s both" : "none",
            }}
          />
          {/* Border ring — center=(50%, 780px) R=585px */}
          <div style={{
            position: "absolute",
            left: "calc(50% - 585px)", top: 64,
            width: 1170, height: 1170,
            borderRadius: "50%",
            border: "1.5px solid rgba(59,130,246,0.55)",
            boxShadow: "0 0 0 8px rgba(37,99,235,0.06)",
            pointerEvents: "none",
            zIndex: 2,
            opacity: globe2Visible ? 1 : 0,
            transition: "opacity 0.8s ease 0.3s",
          }} />
          {/* Bottom fade */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"38%", zIndex:4, pointerEvents:"none", background:"linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.9) 40%, transparent 100%)" }} />

          {/* Floating tool cards */}
          {([
            { label:"WhatsApp",      color:"#25D366", delay:"0.4s", float:"g2-float-a", left:"calc(50% - 590px)", top:310,
              icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
            { label:"Slack",         color:"#E01E5A", delay:"0.55s", float:"g2-float-b", left:"calc(50% - 250px)", top:55,
              icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.527 2.527 0 012.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 012.521 2.521 2.527 2.527 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z" fill="#E01E5A"/></svg> },
            { label:"Notion",        color:"#000",    delay:"0.65s", float:"g2-float-c", left:"calc(50% + 140px)", top:40,
              icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="black"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg> },
            { label:"HubSpot",       color:"#FF7A59", delay:"0.5s",  float:"g2-float-a", left:"calc(50% + 530px)", top:170,
              icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="#FF7A59"><path d="M18.164 7.93V5.084a2.198 2.198 0 001.27-1.976V3.07A2.198 2.198 0 0017.24.875h-.038a2.198 2.198 0 00-2.193 2.195v.038a2.198 2.198 0 001.269 1.976V7.93a6.232 6.232 0 00-2.965 1.3L5.786 3.46a2.44 2.44 0 00.085-.628 2.45 2.45 0 10-2.449 2.45c.44 0 .852-.12 1.206-.326l7.4 5.664a6.25 6.25 0 00-.822 3.13c0 1.228.355 2.374.97 3.34l-2.252 2.252a1.928 1.928 0 00-.56-.088 1.946 1.946 0 101.946 1.946c0-.204-.032-.4-.088-.585l2.224-2.224a6.274 6.274 0 004.418 1.83c3.47 0 6.284-2.814 6.284-6.284 0-3.25-2.47-5.932-5.684-6.207zm-.924 9.87a3.047 3.047 0 110-6.094 3.047 3.047 0 010 6.094z"/></svg> },
            { label:"Google Sheets", color:"#0F9D58", delay:"0.7s",  float:"g2-float-b", left:"calc(50% + 430px)", top:430,
              icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" fill="#0F9D58"/><path d="M8 8h8M8 12h8M8 16h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg> },
            { label:"ChatGPT",       color:"#10a37f", delay:"0.6s",  float:"g2-float-c", left:"calc(50% - 540px)", top:480,
              icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="#10a37f"><path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 004.981 4.18a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 24a6.056 6.056 0 005.772-4.206 5.99 5.99 0 003.997-2.9 6.056 6.056 0 00-.747-7.073zM13.26 22.43a4.476 4.476 0 01-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.494 4.494zM3.6 18.304a4.47 4.47 0 01-.535-3.014l.142.085 4.783 2.759a.771.771 0 00.78 0l5.843-3.369v2.332a.08.08 0 01-.033.062L9.74 19.95a4.5 4.5 0 01-6.14-1.646zM2.34 7.896a4.485 4.485 0 012.366-1.973V11.6a.766.766 0 00.388.676l5.815 3.355-2.02 1.168a.076.076 0 01-.071 0l-4.83-2.786A4.504 4.504 0 012.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 01.071 0l4.83 2.791a4.494 4.494 0 01-.676 8.105v-5.678a.79.79 0 00-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 00-.785 0L9.409 9.23V6.897a.066.066 0 01.028-.061l4.83-2.787a4.5 4.5 0 016.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 01-.038-.057V6.075a4.5 4.5 0 017.375-3.453l-.142.08-4.778 2.758a.795.795 0 00-.396.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg> },
          ] as const).map(({ label, color, delay, float, left, top, icon }) => (
            <div key={label} className="globe-tool-card" style={{
              position: "absolute", left, top, zIndex: 10,
              opacity: globe2Visible ? 1 : 0,
              animation: globe2Visible ? `g2-card-in 0.7s cubic-bezier(0.22,1,0.36,1) ${delay} both, ${float} 3.8s ease-in-out ${delay} infinite` : "none",
              background: "#ffffff",
              borderRadius: 14,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.07)",
              padding: "9px 14px",
              display: "flex", alignItems: "center", gap: 8,
              fontSize: "0.8rem", fontWeight: 600,
              fontFamily: "var(--font-poppins)",
              whiteSpace: "nowrap" as const,
              color: "#1a1a1a",
              pointerEvents: "none",
            }}>
              {icon}
              {label}
            </div>
          ))}

          {/* Bottom fade */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"38%", zIndex:4, pointerEvents:"none", background:"linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.9) 40%, transparent 100%)" }} />
        </div>
      </section>

      {/* ── UBICACIÓN ── */}
      <ScrollReveal delay={0.05}>
      <section id="ubicacion" style={{ background:"#fff", padding:"3rem 1.5rem 4rem" }}>
        <div style={{ maxWidth:1050, margin:"0 auto" }}>
          {/* Title */}
          <p style={{ fontSize:"0.72rem", fontWeight:600, color:"#aaa", letterSpacing:"0.12em", textTransform:"uppercase" as const, fontFamily:"var(--font-poppins)", marginBottom:"1rem" }}>Encuéntranos en</p>
          {/* Map — full width, no border, rounded top */}
          <div style={{ borderRadius:"20px 20px 0 0", overflow:"hidden" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.9!2d-3.7083!3d40.4329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCalle+Blasco+de+Garay+63%2C+Chamber%C3%AD%2C+Madrid!5e0!3m2!1ses!2ses!4v1"
              width="100%" height="320"
              style={{ border:0, display:"block" }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          {/* Bar below map — rounded bottom, same width */}
          <div style={{ background:"#f7f8f9", borderRadius:"0 0 20px 20px", border:"1px solid #ebebeb", borderTop:"none", padding:"1.1rem 1.6rem", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1.5rem", flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{ fontSize:"0.85rem", fontWeight:500, color:"#1a1a1a", fontFamily:"var(--font-poppins)", letterSpacing:"-0.01em" }}>C/ Blasco de Garay 63, Local 2 · Chamberí · Madrid</span>
              <span style={{ fontSize:"0.75rem", color:"#bbb", fontFamily:"var(--font-poppins)", marginLeft:"0.5rem" }}>· Chamberí · 28015 Madrid</span>
            </div>
            <a href="https://maps.google.com/?q=Calle+Blasco+de+Garay+63+Chamberí+Madrid" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", background:"#fff", color:"#555", fontWeight:500, fontSize:"0.8rem", padding:"0.55rem 1rem", borderRadius:8, textDecoration:"none", fontFamily:"var(--font-poppins)", border:"1px solid #e0e0e0", flexShrink:0 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Cómo llegar
            </a>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <div id="agendar"><ScrollReveal delay={0.05}><CalBookingSection /></ScrollReveal></div>

      <ScrollReveal delay={0.05}><FaqSection /></ScrollReveal>

      {/* ── FOOTER ── */}
      <footer style={{ position:"relative", overflow:"hidden", contentVisibility:"auto", containIntrinsicSize:"0 420px" }}>
        <div style={{ position:"absolute", inset:0, background:"#0a0c14", zIndex:0 }} />
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%, rgba(37,99,235,0.14) 0%, transparent 65%)", zIndex:0 }} />

        <ScrollReveal delay={0.05}><div style={{ maxWidth:1100, margin:"0 auto", padding:"5rem 2rem 2.5rem", position:"relative", zIndex:1 }}>

          {/* CTA hero */}
          <div className="footer-cta-row" style={{ marginBottom:"4rem", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"3rem", flexWrap:"wrap" }}>
            <div>
              <h2 style={{ fontWeight:700, fontSize:"clamp(2.2rem,4.5vw,3.8rem)", color:"#fff", letterSpacing:"-0.04em", lineHeight:1.08, margin:"0 0 2rem", maxWidth:620 }}>
                ¿Listo para automatizar<br/>
                <em style={{ fontFamily:"Times New Roman, Georgia, serif", fontStyle:"italic", fontWeight:400, color:"rgba(196,210,255,0.9)" }}>tu negocio con IA?</em>
              </h2>
              <a
                href="https://cal.com/n8n-automatizaciones/30min"
                style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"#fff", color:"#1e1b4b", fontWeight:700, fontSize:"0.88rem", padding:"0.75rem 1.6rem", borderRadius:999, textDecoration:"none", letterSpacing:"-0.01em", transition:"background 0.15s, color 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.88)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="#fff"; }}
              >
                Agendar llamada
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>

            {/* Social icons — right side of CTA */}
            <div style={{ display:"flex", flexDirection:"column", gap:"1.2rem", alignItems:"flex-start" }}>
              <div style={{ fontSize:"0.67rem", fontWeight:600, color:"rgba(196,210,255,0.5)", letterSpacing:"0.14em", textTransform:"uppercase" as const, fontFamily:"var(--font-poppins)" }}>Síguenos</div>
              <div style={{ display:"flex", gap:"0.65rem", flexWrap:"wrap" }}>
                {([
                  { label:"Instagram", href:"https://www.instagram.com/n8n.labs/",                         color:"#E1306C",
                    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg> },
                  { label:"X",         href:"https://x.com/N8nLabs",                                      color:"#ffffff",
                    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  { label:"TikTok",    href:"https://www.tiktok.com/@n8nlabs",                            color:"#69C9D0",
                    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg> },
                  { label:"YouTube",   href:"https://www.youtube.com/@n8nlabs_madrid",                    color:"#FF0000",
                    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg> },
                  { label:"Facebook",  href:"https://www.facebook.com/profile.php?id=61560356115236",     color:"#1877F2",
                    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                  { label:"Snapchat",  href:"https://www.snapchat.com/@n8nlabs",                           color:"#FFFC00",
                    icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.317 4.785-.031.559-.06 1.101-.07 1.608.069.035.132.07.193.07.415 0 .86-.36 1.293-.36.37 0 .937.246.937.805 0 .692-1.023.99-1.649 1.19-.232.07-.69.194-.764.407-.054.148.054.346.154.518.182.308.384.693.384 1.23 0 .618-.462 1.114-1.03 1.114-.108 0-.218-.016-.33-.047-.415-.113-.805-.378-1.28-.378-.52 0-.882.354-1.33.815-.648.668-1.455 1.497-2.785 1.497-.072 0-.145-.004-.218-.01-.072.006-.145.01-.218.01-1.33 0-2.137-.83-2.785-1.497-.447-.461-.81-.815-1.33-.815-.475 0-.865.265-1.28.378-.112.031-.222.047-.33.047-.568 0-1.03-.496-1.03-1.114 0-.537.202-.922.384-1.23.1-.172.208-.37.154-.518-.074-.213-.532-.337-.764-.407-.627-.2-1.649-.498-1.649-1.19 0-.559.567-.805.937-.805.434 0 .878.36 1.293.36.061 0 .124-.035.193-.07-.01-.507-.04-1.049-.07-1.608-.086-1.566-.212-3.592.317-4.785C7.86 1.07 11.216.793 12.206.793z"/></svg> },
                ] as const).map(({ label, href, color, icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
                    style={{ width:38, height:38, borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", color, textDecoration:"none", transition:"background 0.15s, transform 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.transform="translateY(0)"; }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links row */}
          <div className="footer-links-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:"2rem", paddingTop:"2.5rem", borderTop:"1px solid rgba(255,255,255,0.12)", marginBottom:"2.5rem" }}>


            {/* Brand */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.9rem" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="17" height="17" viewBox="0 0 34 34" fill="none">
                    <polygon points="17,2 30,9.5 30,24.5 17,32 4,24.5 4,9.5" stroke="rgba(196,210,255,0.9)" strokeWidth="1.8" fill="rgba(255,255,255,0.07)"/>
                    <circle cx="17" cy="17" r="2.4" fill="rgba(196,210,255,0.9)"/>
                    <line x1="17" y1="8" x2="17" y2="14.4" stroke="rgba(196,210,255,0.7)" strokeWidth="1.1"/>
                    <line x1="17" y1="19.6" x2="17" y2="26" stroke="rgba(196,210,255,0.7)" strokeWidth="1.1"/>
                    <line x1="9" y1="12.8" x2="14.6" y2="15.6" stroke="rgba(196,210,255,0.7)" strokeWidth="1.1"/>
                    <line x1="19.4" y1="18.4" x2="25" y2="21.2" stroke="rgba(196,210,255,0.7)" strokeWidth="1.1"/>
                    <line x1="9" y1="21.2" x2="14.6" y2="18.4" stroke="rgba(196,210,255,0.7)" strokeWidth="1.1"/>
                    <line x1="19.4" y1="15.6" x2="25" y2="12.8" stroke="rgba(196,210,255,0.7)" strokeWidth="1.1"/>
                  </svg>
                </div>
                <span style={{ fontWeight:700, fontSize:"0.95rem", color:"#fff", letterSpacing:"-0.02em", fontFamily:"var(--font-poppins)" }}>N8n Labs</span>
              </div>
              <p style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.45)", lineHeight:1.7, maxWidth:220, margin:0, fontFamily:"var(--font-poppins)" }}>
                Automatizaciones con n8n e IA para equipos B2B.
              </p>
            </div>

            {/* Servicios */}
            <div>
              <div style={{ fontSize:"0.67rem", fontWeight:600, color:"rgba(196,210,255,0.6)", letterSpacing:"0.14em", textTransform:"uppercase" as const, marginBottom:"1rem", fontFamily:"var(--font-poppins)" }}>Servicios</div>
              {["Integraciones API","Automatización CRM","Dashboards","Flujos con IA"].map(item => (
                <a key={item} href="#" style={{ display:"block", fontSize:"0.81rem", color:"rgba(255,255,255,0.5)", textDecoration:"none", marginBottom:"0.55rem", fontFamily:"var(--font-poppins)", transition:"color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.5)")}>{item}</a>
              ))}
            </div>

            {/* Empresa */}
            <div>
              <div style={{ fontSize:"0.67rem", fontWeight:600, color:"rgba(196,210,255,0.6)", letterSpacing:"0.14em", textTransform:"uppercase" as const, marginBottom:"1rem", fontFamily:"var(--font-poppins)" }}>Empresa</div>
              {["Nosotros","Proceso","Casos de uso","Blog"].map(item => (
                <a key={item} href="#" style={{ display:"block", fontSize:"0.81rem", color:"rgba(255,255,255,0.5)", textDecoration:"none", marginBottom:"0.55rem", fontFamily:"var(--font-poppins)", transition:"color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.5)")}>{item}</a>
              ))}
            </div>

            {/* Contacto */}
            <div>
              <div style={{ fontSize:"0.67rem", fontWeight:600, color:"rgba(196,210,255,0.6)", letterSpacing:"0.14em", textTransform:"uppercase" as const, marginBottom:"1rem", fontFamily:"var(--font-poppins)" }}>Contacto</div>
              <a href="mailto:soporte@automatizacionesn8n.com" style={{ display:"block", fontSize:"0.81rem", color:"rgba(255,255,255,0.5)", textDecoration:"none", marginBottom:"0.55rem", fontFamily:"var(--font-poppins)", transition:"color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.5)")}>soporte@automatizacionesn8n.com</a>
              <a href="tel:+34606806376" style={{ display:"block", fontSize:"0.81rem", color:"rgba(255,255,255,0.5)", textDecoration:"none", marginBottom:"0.55rem", fontFamily:"var(--font-poppins)", transition:"color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.5)")}>+34 606 806 376</a>
              <div style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.35)", lineHeight:1.6, marginBottom:"0.3rem", fontFamily:"var(--font-poppins)" }}>
                Calle Blasco de Garay 63, Local 2<br/>Chamberí · 28015 Madrid
              </div>
              <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.25)", lineHeight:1.5, fontFamily:"var(--font-poppins)" }}>
                Chamberí · 28015 Madrid
              </div>
              <div style={{ display:"flex", gap:"0.5rem", marginTop:"1rem", flexWrap:"wrap" }}>
                {[
                  { label:"Instagram", href:"https://www.instagram.com/n8n.labs/", icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg> },
                  { label:"X / Twitter", href:"https://x.com/N8nLabs", icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  { label:"TikTok", href:"https://www.tiktok.com/@n8nlabs", icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg> },
                  { label:"YouTube", href:"https://www.youtube.com/@n8nlabs_madrid", icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg> },
                  { label:"Facebook", href:"https://www.facebook.com/profile.php?id=61560356115236", icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                  { label:"Snapchat", href:"https://www.snapchat.com/@n8nlabs", icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.317 4.785-.031.559-.06 1.101-.07 1.608.069.035.132.07.193.07.415 0 .86-.36 1.293-.36.37 0 .937.246.937.805 0 .692-1.023.99-1.649 1.19-.232.07-.69.194-.764.407-.054.148.054.346.154.518.182.308.384.693.384 1.23 0 .618-.462 1.114-1.03 1.114-.108 0-.218-.016-.33-.047-.415-.113-.805-.378-1.28-.378-.52 0-.882.354-1.33.815-.648.668-1.455 1.497-2.785 1.497-.072 0-.145-.004-.218-.01-.072.006-.145.01-.218.01-1.33 0-2.137-.83-2.785-1.497-.447-.461-.81-.815-1.33-.815-.475 0-.865.265-1.28.378-.112.031-.222.047-.33.047-.568 0-1.03-.496-1.03-1.114 0-.537.202-.922.384-1.23.1-.172.208-.37.154-.518-.074-.213-.532-.337-.764-.407-.627-.2-1.649-.498-1.649-1.19 0-.559.567-.805.937-.805.434 0 .878.36 1.293.36.061 0 .124-.035.193-.07-.01-.507-.04-1.049-.07-1.608-.086-1.566-.212-3.592.317-4.785C7.86 1.07 11.216.793 12.206.793z"/></svg> },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                    style={{ width:30, height:30, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.45)", textDecoration:"none", transition:"border-color 0.15s, color 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.6)"; (e.currentTarget as HTMLElement).style.color="#fff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.15)"; (e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.45)"; }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <div style={{ fontSize:"0.67rem", fontWeight:600, color:"rgba(196,210,255,0.6)", letterSpacing:"0.14em", textTransform:"uppercase" as const, marginBottom:"1rem", fontFamily:"var(--font-poppins)" }}>Legal</div>
              {[
                { label:"Política de privacidad", href:"/politica-de-privacidad" },
                { label:"Términos y condiciones", href:"/terminos" },
                { label:"Eliminación de datos",   href:"/eliminacion-de-datos" },
              ].map(({ label, href }) => (
                <a key={href} href={href} style={{ display:"block", fontSize:"0.81rem", color:"rgba(255,255,255,0.5)", textDecoration:"none", marginBottom:"0.55rem", fontFamily:"var(--font-poppins)", transition:"color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.5)")}>{label}</a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div style={{ textAlign:"center" }}>
            <span style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.3)", fontFamily:"var(--font-poppins)" }}>© 2025 N8n Labs. Todos los derechos reservados.</span>
          </div>

        </div></ScrollReveal>
      </footer>

      {/* Cal FAB */}
      <a
        href="https://cal.com/n8n-automatizaciones/30min"
        aria-label="Agendar llamada"
        style={{
          position:"fixed", bottom:96, right:28, zIndex:200,
          width:56, height:56, borderRadius:"50%",
          background:"linear-gradient(145deg, #60a5fa 0%, #2563eb 60%, #1d4ed8 100%)",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 4px 24px rgba(37,99,235,0.55), 0 0 0 1px rgba(255,255,255,0.25) inset, 0 1px 0 rgba(255,255,255,0.4) inset",
          textDecoration:"none",
          transition:"transform 0.2s, box-shadow 0.2s",
          willChange:"transform",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="scale(1.1)"; (e.currentTarget as HTMLElement).style.boxShadow="0 6px 28px rgba(37,99,235,0.6), 0 2px 10px rgba(0,0,0,0.18)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow="0 4px 20px rgba(37,99,235,0.45), 0 2px 8px rgba(0,0,0,0.15)"; }}
      >
        <Sparkles size={22} color="white" strokeWidth={2} />
      </a>

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/34606806376"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        style={{
          position:"fixed", bottom:28, right:28, zIndex:200,
          width:56, height:56, borderRadius:"50%",
          background:"#25d366",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 4px 20px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.15)",
          textDecoration:"none",
          transition:"transform 0.2s, box-shadow 0.2s",
          willChange:"transform",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="scale(1.1)"; (e.currentTarget as HTMLElement).style.boxShadow="0 6px 28px rgba(37,211,102,0.6), 0 2px 10px rgba(0,0,0,0.18)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow="0 4px 20px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.15)"; }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </main>
  );
}
