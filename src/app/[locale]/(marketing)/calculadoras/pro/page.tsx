"use client";
import { useState } from "react";
import { computePro, type WallSystem } from "@/lib/walls/compute";

export default function ProCalculatorsPage() {
  const [system, setSystem] = useState<WallSystem>("ICF-20");
  const [length, setLength] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [waste, setWaste] = useState<string>("5");
  const [out, setOut] = useState<null | {
    area_m2: number; blocks_base: number; waste_pct: number; blocks_total: number;
  }>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  function onCalculate(e: React.FormEvent) {
    e.preventDefault();
    const L = Number(length);
    const H = Number(height);
    const W = Number(waste || 0);
    if (!L || !H) {
      setOut(null);
      return;
    }
    const res = computePro({ system, length_m: L, height_m: H, waste_pct: W });
    setOut(res);
  }

  async function onExportPdf() {
    if (!out) return alert("Primero ejecuta Calcular para generar resultados.");
    setLoadingPdf(true);
    try {
      const payload = {
        system,
        length_m: Number(length),
        height_m: Number(height),
        waste_pct: Number(waste || 0),
        area_m2: out.area_m2,
        blocks_base: out.blocks_base,
        blocks_total: out.blocks_total,
      };
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("PDF failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "calculadora.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error generando PDF");
    } finally {
      setLoadingPdf(false);
    }
  }

  return (
    <main className="min-h-dvh bg-white text-gray-900">
      <section className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Calculadora Pro — ICF México</h1>
        <p className="text-sm text-gray-600 mb-6">Ruta i18n: /[locale]/calculadoras/pro</p>

        <div className="grid gap-4 rounded-2xl shadow-lg p-6 border">
          <form onSubmit={onCalculate} className="grid md:grid-cols-4 gap-4">
            <label className="grid gap-1">
              <span className="text-sm">Sistema</span>
              <select
                value={system}
                onChange={(e) => setSystem(e.target.value as WallSystem)}
                className="border rounded-xl px-3 py-2"
              >
                <option value="ICF-15">ICF-15 (reticular)</option>
                <option value="ICF-20">ICF-20 (reticular)</option>
                <option value="SOLID">Pared Sólida</option>
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-sm">Largo (m)</span>
              <input
                value={length}
                onChange={(e) => setLength(e.target.value)}
                inputMode="decimal"
                placeholder="Ej. 10"
                className="border rounded-xl px-3 py-2"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm">Alto (m)</span>
              <input
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                inputMode="decimal"
                placeholder="Ej. 2.7"
                className="border rounded-xl px-3 py-2"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm">Merma (%)</span>
              <input
                value={waste}
                onChange={(e) => setWaste(e.target.value)}
                inputMode="decimal"
                placeholder="5"
                className="border rounded-xl px-3 py-2"
              />
            </label>

            <div className="md:col-span-4 flex gap-2">
              <button
                type="submit"
                className="rounded-2xl px-4 py-2 bg-black text-white hover:opacity-90"
              >
                Calcular
              </button>

              <button
                type="button"
                onClick={onExportPdf}
                className="rounded-2xl px-4 py-2 border bg-white"
                disabled={loadingPdf}
              >
                {loadingPdf ? "Generando PDF..." : "Exportar PDF"}
              </button>
            </div>
          </form>

          <div className="rounded-xl bg-gray-50 p-4 border">
            <h2 className="font-semibold mb-2">Resultado</h2>
            {out ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div>Área (m²): <b>{out.area_m2.toFixed(2)}</b></div>
                <div>Bloques base: <b>{out.blocks_base.toFixed(2)}</b></div>
                <div>Merma (%): <b>{out.waste_pct.toFixed(0)}%</b></div>
                <div>Bloques totales: <b>{out.blocks_total.toFixed(2)}</b></div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">—</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
