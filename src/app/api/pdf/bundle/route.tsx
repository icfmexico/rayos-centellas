import { NextResponse } from "next/server";
import archiver from "archiver";
import fs from "node:fs";
import path from "node:path";
import { renderToFile } from "@react-pdf/renderer";
import { MakrosSpecPDF } from "@/pdf/makros/MakrosSpec";
import { JoistSpecPDF } from "@/pdf/joist/JoistSpec";
import { StrongTopSpecPDF } from "@/pdf/strongtop/StrongTopSpec";
import { WallsSpecPDF } from "@/pdf/walls/WallsSpec";
import { finished } from "node:stream/promises";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const outputDir = path.join(process.cwd(), "public", "pdf");
  fs.mkdirSync(outputDir, { recursive: true });

  const logoPath = path.join(process.cwd(), "public", "logo", "icf-mexico-logo.png");
  let logoData: Uint8Array | undefined;
  try {
    logoData = fs.readFileSync(logoPath);
  } catch {
    logoData = undefined;
  }

  // Render PDFs individuales (parámetros demo; ajusta si quieres otros defaults)
  const files = [
    {
      name: "ICF-Mexico-Makros.pdf",
      node: <MakrosSpecPDF input={{ peralte_cm: 25, concreto_fc: 200, area_m2: 100 }} logoData={logoData} lang="es" />,
    },
    {
      name: "ICF-Mexico-Joist.pdf",
      node: <JoistSpecPDF input={{ peralte_cm: 25, concreto_fc: 200, area_m2: 100 }} logoData={logoData} lang="es" />,
    },
    {
      name: "ICF-Mexico-StrongTop.pdf",
      node: <StrongTopSpecPDF input={{ peralte_cm: 25, concreto_fc: 200, area_m2: 100 }} logoData={logoData} lang="es" />,
    },
    {
      name: "ICF-Mexico-Muros.pdf",
      node: <WallsSpecPDF system="ICF-20" length_m={10} height_m={2.7} waste_pct={5} logoData={logoData} />,
    },
  ];

  const generated: string[] = [];
  for (const f of files) {
    const outPath = path.join(outputDir, f.name);
    await renderToFile(f.node, outPath);
    generated.push(outPath);
  }

  // Construir ZIP en disco y esperar a que termine
  const zipPath = path.join(outputDir, "ICF-Mexico-Bundle.zip");
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(output);

  for (const f of generated) {
    archive.file(f, { name: path.basename(f) });
  }
  await archive.finalize();
  await finished(output); // ← asegura que el ZIP terminó de escribirse

  const zipBuffer = fs.readFileSync(zipPath);
  return new NextResponse(zipBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="ICF-Mexico-Bundle.zip"',
      "Cache-Control": "no-store",
    },
  });
}
