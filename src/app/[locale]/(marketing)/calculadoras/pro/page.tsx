"use client";
import { useState } from "react";

type WallSystem = "ICF-15" | "ICF-20" | "SOLID";

export default function ProCalculatorsPage() {
  const [length, setLength] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [system, setSystem] = useState<WallSystem>("ICF-20");
  const [result, setResult] = useState<string>("");

  function onCalculate(e: React.FormEvent) {
    e.preventDefault();
    const L = Number(length);
    const H = Number(height);
    if (!L || !H) {
      setResult("Ingresa largo y alto válidos.");
      return;
    }
    const m2 = L * H; // placeholder — conectaremos lógica real luego
    setResult(`Área estimada: ${m2.toFixed(2)} m² — Sistema: ${system}`);
  }

  return (
    <main className="min-h-dvh bg-white text-gray-900">
      <section className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Calculadora Pro — ICF México</h1>
        <p className="text-sm text-gray-600 mb-6">Ruta i18n: /[locale]/calculadoras/pro</p>

        <div className="grid gap-4 rounded-2xl shadow-lg p-6 border">
          <form onSubmit={onCalculate} className="grid md:grid-cols-3 gap-4">
            <label className="grid gap-1">
              <span className="text-sm">Largo (m)</span>
              <input
                value={length}
                onChange={(e) => setLength(e.target.value)}
                inputMode="decimal"
                placeholder="Ej. 12.5"
                className="border rounded-xl px-3 py-2"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm">Alto (m)</span>
              <input
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                inputMode="decimal"
                placeholder="Ej. 2.8"
                className="border rounded-xl px-3 py-2"
              />
            </label>

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

            <div className="md:col-span-3">
              <button
                type="submit"
                className="rounded-2xl px-4 py-2 bg-black text-white hover:opacity-90"
              >
                Calcular
              </button>
            </div>
          </form>

          <div className="rounded-xl bg-gray-50 p-4 border">
            <h2 className="font-semibold mb-1">Resultado</h2>
            <p className="text-sm">{result || "—"}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
