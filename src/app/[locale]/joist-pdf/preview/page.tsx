"use client";
import React, { useMemo, useState } from "react";

export default function JoistPdfPreview() {
  const [peralte] = useState<25>(25); // fijo
  const [fc, setFc] = useState<200 | 250>(200);
  const [area, setArea] = useState<number>(340);
  const [lang, setLang] = useState<"es" | "en">("es");

  const url = useMemo(() => {
    const q = new URLSearchParams({
      peralte: String(peralte), // siempre 25
      fc: String(fc),
      area: String(area),
      lang,
    });
    return `/api/pdf/joist?${q.toString()}`;
  }, [peralte, fc, area, lang]);

  return (
    <div className="min-h-screen bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0A2A66]">Joist PDF — Vista previa</h1>
          <p className="text-sm text-gray-600">Peralte fijo 25 cm · Bilingüe · Logo FS</p>
        </div>
        <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
          Abrir como PDF
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <label className="text-sm">
          <span className="block text-gray-600 mb-1">Peralte (cm)</span>
          <select className="w-full border rounded-md px-2 py-1" value={peralte} onChange={() => {}} disabled>
            <option value={25}>25</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="block text-gray-600 mb-1">Concreto (fc)</span>
          <select className="w-full border rounded-md px-2 py-1" value={fc} onChange={(e) => setFc(Number(e.target.value) as 200 | 250)}>
            <option value={200}>200</option>
            <option value={250}>250</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="block text-gray-600 mb-1">Área (m²)</span>
          <input type="number" min={1} className="w-full border rounded-md px-2 py-1" value={area} onChange={(e) => setArea(Math.max(1, Number(e.target.value) || 0))} />
        </label>

        <div className="text-sm">
          <span className="block text-gray-600 mb-1">Idioma</span>
          <div className="flex gap-2">
            <button className={`px-3 py-1 rounded-md border ${lang === "es" ? "bg-gray-100" : "hover:bg-gray-50"}`} onClick={() => setLang("es")}>ES</button>
            <button className={`px-3 py-1 rounded-md border ${lang === "en" ? "bg-gray-100" : "hover:bg-gray-50"}`} onClick={() => setLang("en")}>EN</button>
          </div>
        </div>

        <div className="text-sm">
          <span className="block text-gray-600 mb-1">URL actual</span>
          <input readOnly className="w-full border rounded-md px-2 py-1 text-xs" value={url} />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <object data={url} type="application/pdf" className="w-full" style={{ height: "75vh" }}>
          <p className="p-4">
            Tu navegador no pudo mostrar el PDF.
            <a className="text-blue-600 underline" href={url} target="_blank" rel="noreferrer"> Ábrelo en una pestaña nueva</a>.
          </p>
        </object>
      </div>
    </div>
  );
}
