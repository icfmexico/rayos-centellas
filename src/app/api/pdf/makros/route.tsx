import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { MakrosSpecPDF } from "@/pdf/makros/MakrosSpec";
import fs from "node:fs";
import path from "node:path";
import type { Lang } from "@/pdf/makros/i18n";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const peralte = Number(searchParams.get("peralte") || 27);
  const fc = Number(searchParams.get("fc") || 200);
  const area = Number(searchParams.get("area") || 100);
  const lang = (searchParams.get("lang") as Lang) || "es";

  const logoPath = path.join(process.cwd(), "public", "logo", "icf-mexico-logo.png");
  let logoData: Uint8Array | undefined;
  try { logoData = fs.readFileSync(logoPath); } catch { logoData = undefined; }

  const stream = await renderToStream(
    // @ts-expect-error react-pdf acepta JSX
    <MakrosSpecPDF input={{ peralte_cm: peralte as any, concreto_fc: fc as any, area_m2: area }} logoData={logoData} lang={lang} />
  );

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="ICF-MEXICO-Makros.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
