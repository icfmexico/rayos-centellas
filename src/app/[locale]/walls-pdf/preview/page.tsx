"use client";
import React, { useMemo, useState } from "react";

export default function WallsPdfPreview() {
  const [system, setSystem] = useState<"ICF-15" | "ICF-20" | "SOLID">("ICF-20");
  const [length, setLength] = useState<number>(10);
  const [height, setHeight] = useState<number>(2.7);
  const [waste, setWaste] = useState<number>(5);

  const url = useMemo(() => {
    const q = new URLSearchParams({
      system,
      length: String(length),
      height: String(height),
      waste: String(waste),
    });
    return `/api/pdf/walls?${q.toString()}`;
  }, [system, length, height, waste]);

  return (
    <div className="min-h-screen bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0A2A66]">Muros PDF — Vista previa</h1>
          <p className="text-sm text-gray-600">Branding OMEGA · Descarga directa</p>
        </div>
        <div className="flex gap-2">
          <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Abrir PDF</a>
          <a href={url + "&dl=1"} className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Descargar PDF</a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <label className="text-sm">
          <span className="block text-gray-600 mb-1">Sistema</span>
          <select className="w-full border rounded-md px-2 py-1" value={system} onChange={(e) => setSystem(e.target.value as any)}>
            <option value="ICF-15">ICF-15</option>
            <option value="ICF-20">ICF-20</option>
            <option value="SOLID">Pared Sólida</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="block text-gray-600 mb-1">Largo (m)</span>
          <input type="number" min={0.1} step="0.1" className="w-full border rounded-md px-2 py-1" value={length} onChange={(e) => setLength(Math.max(0.1, Number(e.target.value) || 0.1))} />
        </label>

        <label className="text-sm">
          <span className="block text-gray-600 mb-1">Alto (m)</span>
          <input type="number" min={0.1} step="0.1" className="w-full border rounded-md px-2 py-1" value={height} onChange={(e) => setHeight(Math.max(0.1, Number(e.target.value) || 0.1))} />
        </label>

        <label className="text-sm">
          <span className="block text-gray-600 mb-1">Merma (%)</span>
          <input type="number" min={0} step="0.5" className="w-full border rounded-md px-2 py-1" value={waste} onChange={(e) => setWaste(Math.max(0, Number(e.target.value) || 0))} />
        </label>

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
