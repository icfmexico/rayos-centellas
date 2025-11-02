"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";

export default function StrongTopPdfPreview() {
  const [fc, setFc] = useState<200 | 250>(200);
  const [area, setArea] = useState<number>(100);
  const [lang, setLang] = useState<"es" | "en">("es");
  const url = useMemo(() => `/api/pdf/strongtop?peralte=25&fc=${fc}&area=${area}&lang=${lang}`, [fc, area, lang]);

  return (
    <div className="min-h-screen bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0A2A66]">StrongTop PDF — Vista previa</h1>
          <p className="text-sm text-gray-600">Peralte fijo 25 cm · Descarga directa</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/es/pdfs" className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-gray-50">← Volver al HUB</Link>
          <a href={url} target="_blank" className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Abrir PDF</a>
          <a href={url + "&dl=1"} className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Descargar PDF</a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <label className="text-sm"><span className="block text-gray-600 mb-1">Concreto (fc)</span>
          <select className="w-full border rounded-md px-2 py-1" value={fc} onChange={e=>setFc(Number(e.target.value) as any)}>
            <option value={200}>200</option><option value={250}>250</option>
          </select>
        </label>
        <label className="text-sm"><span className="block text-gray-600 mb-1">Área (m²)</span>
          <input type="number" min={1} className="w-full border rounded-md px-2 py-1" value={area} onChange={e=>setArea(Math.max(1, Number(e.target.value)||1))}/>
        </label>
        <div className="text-sm">
          <span className="block text-gray-600 mb-1">Idioma</span>
          <div className="flex gap-2">
            <button onClick={()=>setLang("es")} className={`border rounded-md px-3 py-1 text-sm ${lang==="es"?"bg-gray-100":""}`}>ES</button>
            <button onClick={()=>setLang("en")} className={`border rounded-md px-3 py-1 text-sm ${lang==="en"?"bg-gray-100":""}`}>EN</button>
          </div>
        </div>
        <div className="text-sm md:col-span-2">
          <span className="block text-gray-600 mb-1">URL actual</span>
          <input readOnly className="w-full border rounded-md px-2 py-1 text-xs" value={url}/>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <object data={url} type="application/pdf" className="w-full" style={{height:"75vh"}} />
      </div>
    </div>
  );
}
