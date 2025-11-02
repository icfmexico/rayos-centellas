"use client";
import React from "react";
import Link from "next/link";

export default function PdfHubPage() {
  const cards = [
    {
      title: "Makros — Entrepisos y Techos",
      href: "/es/makros-pdf/preview",
      desc: "Peraltes 18/20/25/29/32 · Bilingüe · Descargar PDF",
    },
    {
      title: "Joist — Losa con Viguetas (25 cm)",
      href: "/es/joist-pdf/preview",
      desc: "Peralte fijo 25 cm · Bilingüe · Descargar PDF",
    },
    {
      title: "StrongTop — Losa Aislada (25 cm)",
      href: "/es/strongtop-pdf/preview",
      desc: "Peralte fijo 25 cm · Bilingüe · Descargar PDF",
    },
    {
      title: "Muros — Calculadora Pro (ICF-15 / ICF-20 / Sólido)",
      href: "/es/walls-pdf/preview",
      desc: "Resumen de bloques · Merma · Descargar PDF",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-semibold text-[#0A2A66] mb-2">ICF MÉXICO — PDFs</h1>
      <p className="text-sm text-gray-600 mb-6">Branding OMEGA · Previews y descargas</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="border rounded-xl p-5 hover:shadow-sm transition">
            <h2 className="text-lg font-semibold text-[#0A2A66]">{c.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
            <div className="mt-3 text-sm inline-flex items-center gap-2 text-blue-600">
              <span>Ir al preview</span>
              <span>↗</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
