"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { PAISES } from "@/lib/paises";

const AZUL = "#2563eb";
const TINTA = "#0f172a";
const GRIS = "#64748b";
const LINEA = "#e2e8f0";
const font = "var(--font-poppins)";

const sinTildes = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Bandera como archivo propio (/flags/XX.svg): Windows no dibuja las banderas emoji. */
export function Bandera({ iso, ancho = 22 }: { iso: string; ancho?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/flags/${iso}.svg`} alt="" width={ancho} height={Math.round(ancho * 0.667)} style={{ display: "block", borderRadius: 3, boxShadow: "0 0 0 1px rgba(15,23,42,.12)", flexShrink: 0, objectFit: "cover" }} />
  );
}

/** Selector de país con buscador (estilo shadcn): bandera + prefijo en el botón, lista con búsqueda, flechas, Intro y Esc. */
export default function SelectorPais({ valor, onCambiar }: { valor: string; onCambiar: (iso: string) => void }) {
  const [abierto, setAbierto] = useState(false);
  const [q, setQ] = useState("");
  const [activo, setActivo] = useState(0);
  const caja = useRef<HTMLDivElement>(null);
  const buscador = useRef<HTMLInputElement>(null);
  const lista = useRef<HTMLUListElement>(null);
  const id = useId();
  const actual = PAISES.find((p) => p[0] === valor) ?? PAISES[0];

  const filtrados = useMemo(() => {
    const t = sinTildes(q.trim().replace(/^\+/, ""));
    if (!t) return PAISES;
    return PAISES.filter(([iso, nom, pre]) => sinTildes(nom).includes(t) || pre.startsWith(t) || iso.toLowerCase() === t);
  }, [q]);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => { if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false); };
    document.addEventListener("mousedown", fuera);
    buscador.current?.focus();
    return () => document.removeEventListener("mousedown", fuera);
  }, [abierto]);

  // La opción activa siempre queda a la vista al moverse con el teclado
  useEffect(() => {
    lista.current?.querySelector<HTMLElement>(`[data-i="${activo}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activo]);

  function abrir() {
    setQ("");
    setActivo(Math.max(0, PAISES.findIndex((p) => p[0] === valor)));
    setAbierto(true);
  }
  function elegir(iso: string) {
    onCambiar(iso);
    setAbierto(false);
  }
  function teclas(e: React.KeyboardEvent) {
    if (e.key === "Escape") { e.preventDefault(); setAbierto(false); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActivo((a) => Math.min(a + 1, filtrados.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActivo((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtrados[activo]) elegir(filtrados[activo][0]); }
  }

  return (
    <div ref={caja} style={{ position: "relative", flexShrink: 0 }}>
      <style>{`
        @keyframes nl-menu{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:none}}
        .nl-menu{animation:nl-menu .16s ease both;transform-origin:top left}
        .nl-pais{transition:background .12s}
        .nl-pais[data-activo="true"]{background:#f1f5f9}
        @media (prefers-reduced-motion:reduce){.nl-menu{animation:none}}
      `}</style>
      <button type="button" className="nl-campo" aria-haspopup="listbox" aria-expanded={abierto} aria-controls={id} aria-label={`País: ${actual[1]}`}
        onClick={() => (abierto ? setAbierto(false) : abrir())}
        style={{ display: "flex", alignItems: "center", gap: 8, height: "100%", boxSizing: "border-box", border: `1.5px solid ${abierto ? AZUL : LINEA}`, borderRadius: 14, padding: "0 0.8rem", background: "#fff", cursor: "pointer", fontFamily: font, fontSize: "0.98rem", color: TINTA, boxShadow: abierto ? "0 0 0 4px rgba(37,99,235,.12)" : "none" }}>
        <Bandera iso={actual[0]} />
        <span style={{ fontVariantNumeric: "tabular-nums" }}>+{actual[2]}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={GRIS} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform .18s", transform: abierto ? "rotate(180deg)" : "none" }}><polyline points="6 9 12 15 18 9" /></svg>
      </button>

      {abierto && (
        <div className="nl-menu" onKeyDown={teclas} style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 120, width: "min(320px, 86vw)", background: "#fff", border: `1px solid ${LINEA}`, borderRadius: 14, boxShadow: "0 16px 40px -12px rgba(15,23,42,.25), 0 2px 8px rgba(15,23,42,.06)", overflow: "hidden" }}>
          <div style={{ padding: 8, borderBottom: `1px solid ${LINEA}` }}>
            <input ref={buscador} value={q} onChange={(e) => { setQ(e.target.value); setActivo(0); }} placeholder="Buscar país o prefijo…" aria-label="Buscar país" role="combobox" aria-expanded aria-controls={id}
              style={{ width: "100%", boxSizing: "border-box", border: "none", outline: "none", background: "#f8fafc", borderRadius: 9, padding: "0.6rem 0.75rem", fontFamily: font, fontSize: "0.9rem", color: TINTA }} />
          </div>
          <ul ref={lista} id={id} role="listbox" style={{ listStyle: "none", margin: 0, padding: 6, maxHeight: 264, overflowY: "auto" }}>
            {filtrados.map(([iso, nom, pre], i) => {
              const sel = iso === valor;
              return (
                <li key={iso} role="option" aria-selected={sel} data-i={i} className="nl-pais" data-activo={i === activo} onMouseEnter={() => setActivo(i)} onClick={() => elegir(iso)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.5rem 0.6rem", borderRadius: 9, cursor: "pointer", fontFamily: font, fontSize: "0.9rem", color: TINTA }}>
                  <Bandera iso={iso} />
                  <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nom}</span>
                  <span style={{ color: GRIS, fontVariantNumeric: "tabular-nums", fontSize: "0.82rem" }}>+{pre}</span>
                  {sel && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={AZUL} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>}
                </li>
              );
            })}
            {filtrados.length === 0 && <li style={{ padding: "1rem", textAlign: "center", color: GRIS, fontFamily: font, fontSize: "0.85rem" }}>Ningún país coincide</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
