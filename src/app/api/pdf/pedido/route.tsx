import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import fs from "node:fs";
import path from "node:path";
import { computePedido } from "@/lib/pedido/compute";
import { PedidoPDF } from "@/pdf/pedido/PedidoPDF";

export const runtime = "nodejs";

type Body = { lang?: "es" | "en"; destino?: string; lineas?: { id: number; qty: number }[] };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const lang = body.lang === "en" ? "en" : "es";
  const destino = String(body.destino ?? "").slice(0, 80);
  const lineas = Array.isArray(body.lineas)
    ? body.lineas
        .slice(0, 10)
        .map((l) => ({ id: Number(l.id), qty: Number(l.qty) }))
        .filter((l) => Number.isFinite(l.id) && Number.isFinite(l.qty) && l.qty > 0 && l.qty < 1e7)
    : [];
  if (!destino || lineas.length === 0) {
    return NextResponse.json({ error: "Faltan destino o productos" }, { status: 400 });
  }

  // Los precios se recalculan en el servidor: nunca se confía en cifras enviadas por el navegador.
  const res = computePedido(destino, lineas);

  let logoData: Buffer | undefined;
  try {
    logoData = fs.readFileSync(path.join(process.cwd(), "public", "logo", "icf-mexico-logo.png"));
  } catch {
    logoData = undefined;
  }
  const fecha = new Date().toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stream = await renderToStream(
    <PedidoPDF
      res={res}
      destino={destino}
      lang={lang}
      logoData={logoData}
      fecha={fecha}
      nombre={(l) => (lang === "en" ? l.producto.nombre_en : l.producto.nombre)}
    />
  );

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ICF-Mexico-Estimado.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
