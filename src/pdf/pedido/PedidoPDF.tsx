import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { PedidoResultado } from "@/lib/pedido/compute";

type Lang = "es" | "en";

const C = { blue: "#003A70", text: "#1B1F23", soft: "#6B7280", border: "#E5E7EB", bg: "#F8F9FB" };

const styles = StyleSheet.create({
  page: { paddingTop: 28, paddingBottom: 28, paddingHorizontal: 32, fontSize: 10, fontFamily: "Helvetica", color: C.text },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottom: `2 solid ${C.blue}`, paddingBottom: 10 },
  logo: { width: 170, height: 38, objectFit: "contain" },
  title: { fontSize: 16, color: C.blue, fontWeight: 700, textAlign: "right" },
  sub: { fontSize: 9, color: C.soft, textAlign: "right", marginTop: 2 },
  meta: { marginTop: 14, marginBottom: 10, flexDirection: "row", gap: 24 },
  metaLabel: { fontSize: 8, color: C.soft },
  metaValue: { fontSize: 11, fontWeight: 700 },
  th: { flexDirection: "row", backgroundColor: C.bg, borderBottom: `1 solid ${C.border}`, paddingVertical: 5, paddingHorizontal: 4 },
  tr: { flexDirection: "row", borderBottom: `1 solid ${C.border}`, paddingVertical: 6, paddingHorizontal: 4 },
  cName: { flex: 5 },
  cQty: { flex: 1.4, textAlign: "right" },
  cUnit: { flex: 2, textAlign: "right" },
  cTot: { flex: 2, textAlign: "right" },
  small: { fontSize: 8, color: C.soft },
  totals: { marginTop: 12, alignSelf: "flex-end", width: 240 },
  tRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  grand: { flexDirection: "row", justifyContent: "space-between", borderTop: `1 solid ${C.border}`, paddingTop: 5, marginTop: 3 },
  note: { marginTop: 16, fontSize: 8.5, color: C.soft, lineHeight: 1.4 },
  foot: { position: "absolute", bottom: 18, left: 32, right: 32, textAlign: "center", fontSize: 8, color: C.soft },
});

const L = {
  es: {
    title: "Estimado de precio puesto en obra",
    date: "Fecha",
    dest: "Destino",
    product: "Producto",
    qty: "Cant.",
    unit: "Precio por pieza puesto en obra",
    total: "Total",
    sub: "Subtotal",
    iva: "IVA 16%",
    grand: "Total con IVA",
    menudeo: "Precio de menudeo",
    volumen: "Precio de volumen",
    quote: "Por cotizar",
    note: (d: string) =>
      `Precios en MXN puestos en obra en ${d}; incluyen flete. Estimado informativo sujeto a confirmación de disponibilidad, vigencia y condiciones de entrega.`,
    noteQuote: "Algunos productos requieren cotización de flete para este destino; te respondemos en el menor tiempo posible.",
  },
  en: {
    title: "Delivered-to-site price estimate",
    date: "Date",
    dest: "Destination",
    product: "Product",
    qty: "Qty",
    unit: "Delivered price per piece",
    total: "Total",
    sub: "Subtotal",
    iva: "VAT 16%",
    grand: "Total incl. VAT",
    menudeo: "Standard price",
    volumen: "Volume price",
    quote: "To be quoted",
    note: (d: string) =>
      `Prices in MXN delivered to ${d}; freight included. Informational estimate subject to confirmation of availability, validity and delivery terms.`,
    noteQuote: "Some products need a freight quote for this destination; we will reply as soon as possible.",
  },
} as const;

export function PedidoPDF(props: {
  res: PedidoResultado;
  destino: string;
  lang: Lang;
  logoData?: Buffer;
  fecha: string;
  nombre: (l: PedidoResultado["lineas"][number]) => string;
}) {
  const t = L[props.lang];
  const loc = props.lang === "es" ? "es-MX" : "en-US";
  const mxn = (n: number) => new Intl.NumberFormat(loc, { style: "currency", currency: "MXN" }).format(n);
  const { res } = props;
  return (
    <Document title="ICF México — Estimado" author="ICF México">
      <Page size="LETTER" style={styles.page}>
        <View style={styles.head}>
          {props.logoData ? <Image src={{ data: props.logoData, format: "png" }} style={styles.logo} /> : <View />}
          <View>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.sub}>ICF México</Text>
          </View>
        </View>

        <View style={styles.meta}>
          <View>
            <Text style={styles.metaLabel}>{t.dest}</Text>
            <Text style={styles.metaValue}>{props.destino}</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>{t.date}</Text>
            <Text style={styles.metaValue}>{props.fecha}</Text>
          </View>
        </View>

        <View style={styles.th}>
          <Text style={[styles.cName, styles.small]}>{t.product}</Text>
          <Text style={[styles.cQty, styles.small]}>{t.qty}</Text>
          <Text style={[styles.cUnit, styles.small]}>{t.unit}</Text>
          <Text style={[styles.cTot, styles.small]}>{t.total}</Text>
        </View>
        {res.lineas.map((l, i) => (
          <View key={i} style={styles.tr} wrap={false}>
            <View style={styles.cName}>
              <Text>{props.nombre(l)}</Text>
              <Text style={styles.small}>{l.tarifa === "Volumen" ? t.volumen : t.menudeo}</Text>
            </View>
            <Text style={styles.cQty}>{l.qty.toLocaleString(loc)}</Text>
            <Text style={styles.cUnit}>{l.precioPieza === null ? t.quote : mxn(l.precioPieza)}</Text>
            <Text style={styles.cTot}>{l.total === null ? t.quote : mxn(l.total)}</Text>
          </View>
        ))}

        {res.subtotal !== null && res.iva !== null && res.total !== null && (
          <View style={styles.totals}>
            <View style={styles.tRow}>
              <Text style={{ color: C.soft }}>{t.sub}</Text>
              <Text>{mxn(res.subtotal)}</Text>
            </View>
            <View style={styles.tRow}>
              <Text style={{ color: C.soft }}>{t.iva}</Text>
              <Text>{mxn(res.iva)}</Text>
            </View>
            <View style={styles.grand}>
              <Text style={{ fontWeight: 700 }}>{t.grand}</Text>
              <Text style={{ fontWeight: 700, color: C.blue }}>{mxn(res.total)}</Text>
            </View>
          </View>
        )}

        <Text style={styles.note}>{res.porCotizar ? t.noteQuote : t.note(props.destino)}</Text>
        <Text style={styles.foot}>© {new Date().getFullYear()} ICF México · www.icfmexico.com</Text>
      </Page>
    </Document>
  );
}
