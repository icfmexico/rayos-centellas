import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { WallsSpecPDF } from "@/pdf/walls/WallsSpec";
import fs from "node:fs";
import path from "node:path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const system = (searchParams.get("system") || "ICF-20") as "ICF-15" | "ICF-20" | "SOLID";
  const length_m = Number(searchParams.get("length") || 10);
  const height_m = Number(searchParams.get("height") || 2.7);
  const waste_pct = Number(searchParams.get("waste") || 5);
  const dl = searchParams.get("dl") === "1";

  const logoPath = path.join(process.cwd(), "public", "logo", "icf-mexico-logo.png");
  let logoData: Uint8Array | undefined;
  try { logoData = fs.readFileSync(logoPath); } catch { logoData = undefined; }

  const stream = await renderToStream(
    // @ts-expect-error React-PDF acepta JSX
    <WallsSpecPDF system={system} length_m={length_m} height_m={height_m} waste_pct={waste_pct} logoData={logoData} />
  );

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${dl ? "attachment" : "inline"}; filename="ICF-MEXICO-Calculadora-Pro.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
