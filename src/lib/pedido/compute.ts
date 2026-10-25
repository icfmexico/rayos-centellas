// Motor de cálculo del pedido "puesto en obra" — ICF México.
// Replica la hoja "Pedido" de ICF_Mexico_Tabla_Unica_Precios.xlsx.
// Los precios viven en data.json (fuente única). El cliente nunca ve el desglose de flete.
import data from "./data.json";

export type Producto = (typeof data.productos)[number];
export type Ruta = (typeof data.fletes)[number];
export type PedidoLinea = { id: number; qty: number };

export type LineaResultado = {
  producto: Producto;
  qty: number;
  m3: number;
  tarifa: "Menudeo" | "Volumen";
  subtotal: number;
  flete: number | null; // null = por cotizar
  precioPieza: number | null;
  total: number | null;
};

export type PedidoResultado = {
  lineas: LineaResultado[];
  subtotal: number | null;
  iva: number | null;
  total: number | null;
  porCotizar: boolean;
};

const EPS = 1e-6;
export const round2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;

export const productos: Producto[] = data.productos;
/** Productos visibles al cliente (el ICF-15 "local" se aplica solo según el destino). */
export const productosVisibles: Producto[] = data.productos.filter((p) => !p.oculto);

const ICF15_LOCAL = data.productos.find((p) => p.oculto && p.nombre.startsWith("ICF-15 ·"));
const esLocal = (destino: string) => (data.params.destinosLocales as string[]).includes(destino);
/** Precios aplicables: ICF-15 usa precio local en Chihuahua/Juárez y precio foráneo en el resto. */
function preciosDe(p: Producto, destino: string): { p1: number; p2: number } {
  if (ICF15_LOCAL && p.nombre.startsWith("ICF-15 ·") && esLocal(destino)) {
    return { p1: ICF15_LOCAL.p1, p2: ICF15_LOCAL.p2 };
  }
  return { p1: p.p1, p2: p.p2 };
}
export const destinos: string[] = Array.from(new Set(data.fletes.map((f) => f.destino))).sort((a, b) =>
  a.localeCompare(b, "es")
);

function fleteDePlanta(planta: string, destino: string, m3: number): number | null {
  if (m3 <= 0) return 0;
  const ruta = data.fletes.find((f) => f.planta === planta && f.destino === destino);
  if (!ruta) return null;
  const hino = ruta.modo.startsWith("Hino");
  // El ahorro de 30% aplica a rutas "Hino"; las de "tarifa provisional" ya vienen con precio propio.
  const precio = ruta.modo === "Hino" ? ruta.precio * (1 - data.params.ahorroHino) : ruta.precio;
  if (precio === 0) return 0; // entrega gratis
  const capacidad = hino ? data.params.hinoM3 : data.params.terceroM3;
  const camiones = m3 / capacidad;
  const completos = Math.floor(camiones + EPS);
  const resto = camiones - completos;
  const extra = resto > EPS ? Math.max(resto * precio, data.params.minFlete * precio) : 0;
  return round2(completos * precio + extra);
}

export function computePedido(destino: string, lineasIn: PedidoLinea[]): PedidoResultado {
  const lineas = lineasIn
    .map((l) => ({ p: productos.find((x) => x.id === l.id), qty: Number(l.qty) }))
    .filter((l): l is { p: Producto; qty: number } => !!l.p && l.qty > 0)
    .map((l) => ({ ...l, m3: l.qty * l.p.m3 }));

  // Volumen para tarifa: joist + FoamLite cuentan juntos; el resto por producto.
  const claveGrupo = (p: Producto) => (p.grupo === "losa" || p.grupo === "losa-acc" ? "losa" : p.nombre);
  const volGrupo = new Map<string, number>();
  for (const l of lineas) {
    const contable = l.p.grupo === "losa-acc" ? 0 : l.m3;
    const k = claveGrupo(l.p);
    volGrupo.set(k, (volGrupo.get(k) ?? 0) + contable);
  }

  // Flete por planta, cobrado como camiones completos + resto (con piso).
  const m3Planta = new Map<string, number>();
  for (const l of lineas) m3Planta.set(l.p.planta, (m3Planta.get(l.p.planta) ?? 0) + l.m3);
  const fletePlanta = new Map<string, number | null>();
  m3Planta.forEach((m3, planta) => fletePlanta.set(planta, fleteDePlanta(planta, destino, m3)));

  const out: LineaResultado[] = lineas.map((l) => {
    const tarifa = (volGrupo.get(claveGrupo(l.p)) ?? 0) >= data.params.umbralM3 ? "Volumen" : "Menudeo";
    const precios = preciosDe(l.p, destino);
    const unit = tarifa === "Volumen" ? precios.p2 : precios.p1;
    const subtotal = round2(l.qty * unit);
    const fp = fletePlanta.get(l.p.planta);
    const mp = m3Planta.get(l.p.planta) ?? 0;
    const flete = fp === null || fp === undefined ? null : mp === 0 ? 0 : round2((fp * l.m3) / mp);
    const total = flete === null ? null : round2(subtotal + flete);
    return {
      producto: l.p,
      qty: l.qty,
      m3: l.m3,
      tarifa,
      subtotal,
      flete,
      precioPieza: total === null ? null : round2(total / l.qty),
      total,
    };
  });

  const cotizados = out.filter((l) => l.total !== null);
  const porCotizar = out.some((l) => l.total === null);
  const subtotal = cotizados.length ? round2(cotizados.reduce((a, l) => a + (l.total as number), 0)) : null;
  const iva = subtotal === null ? null : round2(subtotal * data.params.iva);
  const total = subtotal === null || iva === null ? null : round2(subtotal + iva);
  return { lineas: out, subtotal, iva, total, porCotizar };
}
