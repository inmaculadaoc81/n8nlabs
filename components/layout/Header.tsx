"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Los anclajes llevan "/" delante para que también funcionen desde /blog y las páginas legales
const navLinksBase = [
  { label: "Inicio",               href: "/" },
  { label: "Servicios",            href: "/#servicios" },
  { label: "¿Dónde nos ubicamos?", href: "/#ubicacion" },
];

// showBlog: el enlace al blog solo aparece cuando ya hay artículos publicados
export default function Header({ showBlog = false }: { showBlog?: boolean }) {
  const navLinks = showBlog ? [...navLinksBase, { label: "Blog", href: "/blog" }] : navLinksBase;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── TOP INFO BAR ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 101,
        height: 36, background: "#efefef",
        borderBottom: "1px solid #d8d8d8",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "2rem", padding: "0 1rem",
      }}>
        {/* WhatsApp */}
        <a href="https://wa.me/34606806376" target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", gap:"0.4rem", fontSize:"0.75rem", color:"#1a1a1a", textDecoration:"none", fontFamily:"var(--font-poppins)", letterSpacing:"-0.01em", fontWeight:600, whiteSpace:"nowrap", flexShrink:0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#25D366" style={{ flexShrink:0 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          +34 606 806 376
        </a>
        <span className="hidden sm:inline-block" style={{ width:1, height:14, background:"#ddd" }} />
        <a href="https://maps.google.com/?q=Calle+Blasco+de+Garay+63+Chamberí+Madrid" target="_blank" rel="noopener noreferrer" className="hidden sm:flex" style={{ alignItems:"center", gap:"0.4rem", fontSize:"0.75rem", color:"#666", textDecoration:"none", fontFamily:"var(--font-poppins)", letterSpacing:"-0.01em", whiteSpace:"nowrap" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Calle Blasco de Garay 63, Local 2 · Chamberí · Madrid
        </a>
      </div>

      {/* ── DESKTOP ── */}
      <header
        className="hidden md:flex"
        style={{
          position: "fixed",
          top: 36, left: 0, right: 0,
          zIndex: 100,
          height: 64,
          alignItems: "center",
          background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "1px solid transparent",
          boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
          transition: "background 0.3s, box-shadow 0.3s, border-color 0.3s, backdrop-filter 0.3s",
          padding: "0 2rem",
        }}
      >
        {/* Inner container */}
        <div style={{ width: "100%", maxWidth: 1170, margin: "0 auto", display: "flex", alignItems: "center", gap: 2 }}>

        {/* Logo + wordmark */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.55rem", flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(37,99,235,0.14)", flexShrink: 0 }}>
            <img src="/logogeneral.png" alt="n8nlabs" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f0f0f", letterSpacing: "-0.025em", fontFamily: "var(--font-poppins)" }}>n8nlabs</span>
        </Link>

        {/* Nav — centered */}
        <nav style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "inline-flex", alignItems: "center",
                padding: "0.4rem 0.9rem",
                fontSize: "0.85rem", fontWeight: 500,
                color: "#555", textDecoration: "none",
                borderRadius: 8,
                fontFamily: "var(--font-poppins)",
                letterSpacing: "-0.01em",
                transition: "background 0.15s, color 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.05)"; (e.currentTarget as HTMLElement).style.color = "#0f0f0f"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#555"; }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="https://cal.com/n8n-automatizaciones/30min"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.35rem",
            background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)",
            color: "#fff",
            fontSize: "0.85rem", fontWeight: 600,
            padding: "0.5rem 1.15rem",
            borderRadius: 999,
            textDecoration: "none",
            fontFamily: "var(--font-poppins)",
            letterSpacing: "-0.01em",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 2px 10px rgba(37,99,235,0.3)",
            transition: "box-shadow 0.15s, transform 0.15s",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 18px rgba(37,99,235,0.45)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(37,99,235,0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          Agendar llamada
        </Link>
        </div>
      </header>

      {/* ── MOBILE ── */}
      <header
        style={{
          position: "fixed",
          top: 36, left: 0, right: 0,
          zIndex: 100,
          background: scrolled || menuOpen ? "rgba(255,255,255,0.95)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled || menuOpen ? "blur(16px)" : "none",
          borderBottom: scrolled || menuOpen ? "1px solid rgba(0,0,0,0.07)" : "1px solid transparent",
          boxShadow: scrolled || menuOpen ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
          transition: "background 0.3s, box-shadow 0.3s, border-color 0.3s",
        }}
        className="md:hidden"
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, padding: "0 1rem" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(37,99,235,0.14)", flexShrink: 0 }}>
              <img src="/logogeneral.png" alt="n8nlabs" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f0f0f", letterSpacing: "-0.025em", fontFamily: "var(--font-poppins)" }}>n8nlabs</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="https://cal.com/n8n-automatizaciones/30min" style={{
              display: "inline-flex", alignItems: "center", gap: "0.3rem",
              background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)",
              color: "#fff", fontSize: "0.8rem", fontWeight: 600,
              padding: "0.42rem 0.85rem", borderRadius: 999,
              textDecoration: "none", whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              fontFamily: "var(--font-poppins)",
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Agendar
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: 34, height: 34, borderRadius: 8,
                background: menuOpen ? "#f0f0f0" : "#f5f5f5",
                border: "1px solid rgba(0,0,0,0.08)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s",
              }}
              aria-label="Toggle menu"
            >
              {menuOpen
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2.4" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Dropdown */}
        <div style={{ maxHeight: menuOpen ? "260px" : "0", overflow: "hidden", transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
          <nav style={{ padding: "6px 10px 12px", display: "flex", flexDirection: "column", gap: 2, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex", alignItems: "center", padding: "0.65rem 0.85rem",
                  fontSize: "0.88rem", fontWeight: 500, color: "#444",
                  textDecoration: "none", borderRadius: 8,
                  fontFamily: "var(--font-poppins)",
                  transition: "background 0.12s, color 0.12s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f5f5f5"; (e.currentTarget as HTMLElement).style.color = "#0f0f0f"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#444"; }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
