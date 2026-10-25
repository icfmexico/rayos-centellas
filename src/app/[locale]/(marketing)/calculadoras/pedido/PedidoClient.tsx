"use client";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { computePedido, destinos, productosVisibles, type Producto } from "@/lib/pedido/compute";

type Fila = { id: number; qty: string };
const MAX_FILAS = 10;
const BLUE = "#003A70";

const T = {
  es: {
    title: "Estimado de precio puesto en obra",
    sub: "Elige el destino y tus productos. El precio incluye el flete.",
    dest: "Destino",
    pickDest: "Selecciona un destino",
    other: "Otro destino (por cotizar)",
    product: "Producto",
    qty: "Cantidad",
    add: "Agregar producto",
    remove: "Quitar",
    unitPrice: "Precio por pieza puesto en obra",
    total: "Total",
    subtotal: "Subtotal",
    iva: "IVA 16%",
    grand: "Total con IVA",
    quote: "Por cotizar",
    includes: (d: string) => `Precios puestos en obra en ${d}, en MXN. Vigencia sujeta a confirmación.`,
    needQuote:
      "Hay productos con flete por cotizar para este destino. Te respondemos en el menor tiempo posible.",
    condition: "Condición",
    menudeo: "Precio de menudeo",
    volumen: "Precio de volumen",
    empty: "Agrega al menos un producto con cantidad.",
    wa: "Solicitar cotización",
    pdf: "Descargar estimado (PDF)",
    pdfBusy: "Generando PDF…",
    pdfErr: "No se pudo generar el PDF. Intenta de nuevo.",
    waHello: "Hola, quiero cotizar con ICF México:",
    waDest: "Destino",
    waTotal: "Total estimado con IVA",
    waQuote: "Total por cotizar",
  },
  en: {
    title: "Delivered-to-site price estimate",
    sub: "Choose the destination and your products. Price includes freight.",
    dest: "Destination",
    pickDest: "Select a destination",
    other: "Other destination (to be quoted)",
    product: "Product",
    qty: "Quantity",
    add: "Add product",
    remove: "Remove",
    unitPrice: "Delivered price per piece",
    total: "Total",
    subtotal: "Subtotal",
    iva: "VAT 16%",
    grand: "Total incl. VAT",
    quote: "To be quoted",
    includes: (d: string) => `Prices delivered to ${d}, in MXN. Validity subject to confirmation.`,
    needQuote: "Some products need a freight quote for this destination. We will reply as soon as possible.",
    condition: "Pricing",
    menudeo: "Standard price",
    volumen: "Volume price",
    empty: "Add at least one product with a quantity.",
    wa: "Request a quote",
    pdf: "Download estimate (PDF)",
    pdfBusy: "Generating PDF…",
    pdfErr: "The PDF could not be generated. Please try again.",
    waHello: "Hello, I would like a quote from ICF México:",
    waDest: "Destination",
    waTotal: "Estimated total incl. VAT",
    waQuote: "Total to be quoted",
  },
} as const;
const WHATSAPP = "5216143555565";

const mxn = (n: number, lang: "es" | "en") =>
  new Intl.NumberFormat(lang === "es" ? "es-MX" : "en-US", { style: "currency", currency: "MXN" }).format(n);

export default function PedidoClient({ serifClass }: { serifClass: string }) {
  const params = useParams<{ locale?: string }>();
  const lang: "es" | "en" = params?.locale === "en" ? "en" : "es";
  const t = T[lang];

  const [destino, setDestino] = useState("");
  const [filas, setFilas] = useState<Fila[]>([{ id: 0, qty: "" }]);

  const grupos = useMemo(() => {
    const m = new Map<string, Producto[]>();
    for (const p of productosVisibles) m.set(p.sistema, [...(m.get(p.sistema) ?? []), p]);
    return Array.from(m.entries());
  }, []);

  const res = useMemo(
    () => computePedido(destino, filas.filter((f) => f.id > 0).map((f) => ({ id: f.id, qty: Number(f.qty) }))),
    [destino, filas]
  );

  const setFila = (i: number, patch: Partial<Fila>) =>
    setFilas((fs) => fs.map((f, k) => (k === i ? { ...f, ...patch } : f)));
  const nombre = (p: Producto) => (lang === "en" ? p.nombre_en : p.nombre);
  const tieneLineas = res.lineas.length > 0;
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const waHref = useMemo(() => {
    const lines = res.lineas.map(
      (l) => `• ${l.qty.toLocaleString(lang === "es" ? "es-MX" : "en-US")} × ${nombre(l.producto)}`
    );
    const cierre = res.total === null ? t.waQuote : `${t.waTotal}: ${mxn(res.total, lang)}`;
    const msg = [t.waHello, "", ...lines, "", `${t.waDest}: ${destino === "__otro__" ? "—" : destino}`, cierre].join("\n");
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res, destino, lang]);

  async function descargarPdf() {
    setPdfBusy(true);
    setPdfError(false);
    try {
      const r = await fetch("/api/pdf/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          destino,
          lineas: filas.filter((f) => f.id > 0).map((f) => ({ id: f.id, qty: Number(f.qty) })),
        }),
      });
      if (!r.ok) throw new Error("pdf");
      const url = URL.createObjectURL(await r.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = "ICF-Mexico-Estimado.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setPdfError(true);
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <main className="min-h-dvh bg-white text-gray-900">
      <section className="max-w-4xl mx-auto px-4 py-10">
        <h1 className={`${serifClass} text-4xl md:text-5xl`} style={{ color: BLUE }}>
          ICF México
        </h1>
        <p className={`${serifClass} text-xl italic text-gray-600 mt-1`}>{t.title}</p>
        <p className="text-sm text-gray-600 mt-2 mb-8">{t.sub}</p>

        <label className="grid gap-1 max-w-sm mb-6">
          <span className="text-sm font-medium">{t.dest}</span>
          <select
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className="border rounded-xl px-3 py-2 bg-white"
          >
            <option value="">{t.pickDest}</option>
            {destinos.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
            <option value="__otro__">{t.other}</option>
          </select>
        </label>

        <div className="grid gap-3">
          {filas.map((f, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end min-w-0">
              <label className="col-span-12 md:col-span-7 grid gap-1 min-w-0">
                <span className="text-xs text-gray-600">{t.product}</span>
                <select
                  value={f.id}
                  onChange={(e) => setFila(i, { id: Number(e.target.value) })}
                  className="border rounded-xl px-3 py-2 bg-white w-full min-w-0 truncate"
                >
                  <option value={0}>—</option>
                  {grupos.map(([sis, ps]) => (
                    <optgroup key={sis} label={sis}>
                      {ps.map((p) => (
                        <option key={p.id} value={p.id}>
                          {nombre(p)}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
              <label className="col-span-8 md:col-span-3 grid gap-1 min-w-0">
                <span className="text-xs text-gray-600">{t.qty}</span>
                <input
                  value={f.qty}
                  onChange={(e) => setFila(i, { qty: e.target.value.replace(/[^0-9.]/g, "") })}
                  inputMode="decimal"
                  className="border rounded-xl px-3 py-2 w-full min-w-0"
                  placeholder="0"
                />
              </label>
              <button
                type="button"
                onClick={() => setFilas((fs) => (fs.length > 1 ? fs.filter((_, k) => k !== i) : [{ id: 0, qty: "" }]))}
                className="col-span-4 md:col-span-2 border rounded-xl px-3 py-2 text-sm bg-white"
              >
                {t.remove}
              </button>
            </div>
          ))}
        </div>

        {filas.length < MAX_FILAS && (
          <button
            type="button"
            onClick={() => setFilas((fs) => [...fs, { id: 0, qty: "" }])}
            className="mt-3 rounded-xl px-4 py-2 text-sm text-white"
            style={{ background: BLUE }}
          >
            + {t.add}
          </button>
        )}

        <div className="mt-10 rounded-2xl border p-5" style={{ borderColor: "#d7dde5" }}>
          {!destino || !tieneLineas ? (
            <p className="text-sm text-gray-600">{t.empty}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="py-2 pr-2 font-medium">{t.product}</th>
                      <th className="py-2 pr-2 font-medium text-right">{t.qty}</th>
                      <th className="py-2 pr-2 font-medium text-right">{t.unitPrice}</th>
                      <th className="py-2 font-medium text-right">{t.total}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {res.lineas.map((l, i) => (
                      <tr key={i} className="border-b last:border-0 align-top">
                        <td className="py-2 pr-2">
                          {nombre(l.producto)}
                          <div className="text-xs text-gray-500">{l.tarifa === "Volumen" ? t.volumen : t.menudeo}</div>
                        </td>
                        <td className="py-2 pr-2 text-right">{l.qty.toLocaleString(lang === "es" ? "es-MX" : "en-US")}</td>
                        <td className="py-2 pr-2 text-right font-medium">
                          {l.precioPieza === null ? t.quote : mxn(l.precioPieza, lang)}
                        </td>
                        <td className="py-2 text-right">{l.total === null ? t.quote : mxn(l.total, lang)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {res.subtotal !== null && (
                <dl className="mt-4 ml-auto max-w-xs grid grid-cols-2 gap-y-1 text-sm">
                  <dt className="text-gray-600">{t.subtotal}</dt>
                  <dd className="text-right">{mxn(res.subtotal, lang)}</dd>
                  <dt className="text-gray-600">{t.iva}</dt>
                  <dd className="text-right">{res.iva === null ? "" : mxn(res.iva, lang)}</dd>
                  <dt className="font-semibold pt-1 border-t">{t.grand}</dt>
                  <dd className="text-right font-semibold pt-1 border-t" style={{ color: BLUE }}>
                    {res.total === null ? "" : mxn(res.total, lang)}
                  </dd>
                </dl>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl px-4 py-2 text-sm text-white"
                  style={{ background: BLUE }}
                >
                  {t.wa}
                </a>
                {destino !== "__otro__" && (
                  <button
                    type="button"
                    onClick={descargarPdf}
                    disabled={pdfBusy}
                    className="rounded-xl px-4 py-2 text-sm border bg-white"
                  >
                    {pdfBusy ? t.pdfBusy : t.pdf}
                  </button>
                )}
              </div>
              {pdfError && <p className="mt-2 text-xs text-red-700">{t.pdfErr}</p>}

              <p className="mt-4 text-xs italic text-gray-600">
                {res.porCotizar || destino === "__otro__" ? t.needQuote : t.includes(destino)}
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
