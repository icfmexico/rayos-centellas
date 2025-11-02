import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { brand, docMeta } from "./theme";

type System = "ICF-15" | "ICF-20" | "SOLID";

const BLOCKS_PER_M2: Record<System, number> = {
  "ICF-15": 2.77,
  "ICF-20": 3.33,
  SOLID: 2.0,
};

const styles = StyleSheet.create({
  page: { flexDirection: "column", paddingTop: 24, paddingBottom: 20, paddingHorizontal: 28, backgroundColor: brand.colors.bg },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottom: `1 solid ${brand.colors.border}`, paddingBottom: 8, marginBottom: 10 },
  logo: { width: 180, height: 40, objectFit: "contain" },
  titleBlock: { textAlign: "right" },
  title: { fontSize: brand.fonts.size.title, color: brand.colors.primary, fontWeight: brand.fonts.weight.bold },
  subtitle: { fontSize: brand.fonts.size.subtitle, color: brand.colors.soft, marginTop: 2 },
  section: { marginTop: 12 },
  card: { border: `1 solid ${brand.colors.border}`, borderRadius: brand.layout.card.radius, padding: brand.layout.card.pad, gap: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { fontSize: brand.fonts.size.body, color: brand.colors.soft },
  value: { fontSize: brand.fonts.size.body, color: brand.colors.text, fontWeight: brand.fonts.weight.bold },
  h2: { fontSize: brand.fonts.size.h2, color: brand.colors.primary, fontWeight: brand.fonts.weight.bold, marginBottom: 6 },
  footer: { marginTop: 12, fontSize: brand.fonts.size.small, color: brand.colors.soft, textAlign: "center" },
  hr: { borderTop: `1 solid ${brand.colors.border}`, marginTop: 8, marginBottom: 8 },
});

export function WallsSpecPDF(props: {
  system: System;
  length_m: number;
  height_m: number;
  waste_pct: number;
  logoData?: Uint8Array;
}) {
  const area_m2 = +(props.length_m * props.height_m).toFixed(2);
  const blocks_base = +(area_m2 * BLOCKS_PER_M2[props.system]).toFixed(2);
  const blocks_total = +(blocks_base * (1 + props.waste_pct / 100)).toFixed(2);

  return (
    <Document title={docMeta.title} author={docMeta.author} subject="ICF MÉXICO — Calculadora Pro">
      <Page size="LETTER" orientation="portrait" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          {props.logoData ? <Image src={{ data: props.logoData, format: "png" }} style={styles.logo} /> : <View />}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>ICF MÉXICO — Calculadora Pro</Text>
            <Text style={styles.subtitle}>{new Date().toLocaleString()}</Text>
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.section}>
          <Text style={styles.h2}>Resumen del cálculo</Text>
          <View style={styles.card}>
            <View style={styles.row}><Text style={styles.label}>Sistema</Text><Text style={styles.value}>{props.system}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Largo (m)</Text><Text style={styles.value}>{props.length_m}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Alto (m)</Text><Text style={styles.value}>{props.height_m}</Text></View>
          </View>
        </View>

        {/* Resultados */}
        <View style={styles.section}>
          <Text style={styles.h2}>Resultados</Text>
          <View style={styles.card}>
            <View style={styles.row}><Text style={styles.label}>Área (m²)</Text><Text style={styles.value}>{area_m2}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Bloques base</Text><Text style={styles.value}>{blocks_base}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Merma (%)</Text><Text style={styles.value}>{props.waste_pct}%</Text></View>
            <View style={styles.row}><Text style={styles.label}>Bloques totales</Text><Text style={styles.value}>{blocks_total}</Text></View>
          </View>
        </View>

        <View style={styles.hr} />
        <View style={styles.footer}>
          <Text>{brand.footer.text(new Date().getFullYear())}</Text>
        </View>
      </Page>
    </Document>
  );
}
