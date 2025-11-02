"use client";
import Link from "next/link";

const cards = [
  {
    title: "Makros — Entrepisos/Techos",
    href: "/es/makros-pdf/preview",
    api: "/api/pdf/makros?peralte=27&fc=200&area=340&lang=es",
    desc: "PDF bilingüe, logo FS, controles.",
  },
  {
    title: "Joist — Losa con Viguetas",
    href: "/es/joist-pdf/preview",
    api: "/api/pdf/joist?peralte=27&fc=200&area=340&lang=es",
    desc: "Clon con preview y ES/EN.",
  },
  {
    title: "StrongTop — Losa Aislada",
    href: "/es/strongtop-pdf/preview",
    api: "/api/pdf/strongtop?peralte=25&fc=200&area=120&lang=es",
    desc: "Clon con preview y ES/EN.",
  },
];

export default function PdfHub() {
  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-semibold text-[#0A2A66]">ICF MEXICO — Centro de PDFs</h1>
      <p className="text-sm text-gray-600 mb-6">
        Previews con controles y accesos directos a las rutas API (bilingüe).
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="border rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{c.title}</h2>
            <p className="text-xs text-gray-600 mb-3">{c.desc}</p>
            <div className="flex gap-2">
              <Link href={c.href} className="text-sm px-3 py-1 border rounded-md hover:bg-gray-50">
                Abrir preview
              </Link>
              <a href={c.api} target="_blank" rel="noreferrer" className="text-sm px-3 py-1 border rounded-md hover:bg-gray-50">
                Abrir PDF
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
