import type { Metadata } from "next";
import Formulario from "./Formulario";

// Solo se llega desde el mensaje privado del vídeo: no se indexa.
export const metadata: Metadata = {
  title: "¿Encaja tu negocio? | N8n Labs",
  description: "8 preguntas rápidas para saber si podemos automatizar tu negocio con n8n.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Formulario />;
}
