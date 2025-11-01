import { NextResponse } from "next/server";
import { generatePdfBuffer, type PdfData } from "@/lib/pdf/generate.tsx";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data: PdfData = {
      system: String(body.system),
      length_m: Number(body.length_m),
      height_m: Number(body.height_m),
      waste_pct: Number(body.waste_pct ?? 0),
      area_m2: Number(body.area_m2),
      blocks_base: Number(body.blocks_base),
      blocks_total: Number(body.blocks_total),
      generatedAt: new Date().toLocaleString(),
    };

    const pdfBuffer = await generatePdfBuffer(data);
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="calculadora.pdf"',
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
