import { NextResponse } from "next/server";

// La web no guarda nada: reenvía las respuestas a la API de Kelatos (que valida, puntúa, clasifica y las guarda para el equipo).
const API = process.env.KELATOS_BLOG_API ?? "https://db.affirmatechnology.com/kelatos-api";

export async function POST(req: Request) {
  const cuerpo = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!cuerpo || typeof cuerpo !== "object") return NextResponse.json({ ok: false, error: "Datos no válidos" }, { status: 400 });
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "";
  try {
    const res = await fetch(`${API}/webhooks/n8nlabs-diagnostico`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...cuerpo, ip }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const j = (await res.json().catch(() => ({}))) as { ok?: boolean; clasificacion?: string; error?: string };
    if (!res.ok || !j.ok) return NextResponse.json({ ok: false, error: j.error || "No se pudo enviar. Inténtalo de nuevo." }, { status: res.status === 429 ? 429 : 400 });
    return NextResponse.json({ ok: true, clasificacion: j.clasificacion });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudo enviar. Inténtalo de nuevo en unos minutos o escríbenos por WhatsApp." }, { status: 502 });
  }
}
