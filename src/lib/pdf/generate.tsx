import React from "react";
import { Document, Page, View, Text, StyleSheet, pdf } from "@react-pdf/renderer";

export type PdfData = {
  system: string;
  length_m: number;
  height_m: number;
  waste_pct: number;
  area_m2: number;
  blocks_base: number;
  blocks_total: number;
  generatedAt?: string;
};

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12, fontFamily: "Helvetica" },
  header: { fontSize: 18, marginBottom: 8, fontWeight: "bold" },
  label: { fontSize: 10, color: "#555", marginTop: 6 },
  row: { display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  box: { border: "1pt solid #ddd", padding: 10, borderRadius: 6, marginTop: 10 },
  footer: { fontSize: 9, color: "#888", marginTop: 20, textAlign: "center" },
});

export async function generatePdfBuffer(data: PdfData) {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>ICF MÉXICO — Calculadora Pro</Text>

        <Text>Resumen del cálculo</Text>

        <View style={styles.box}>
          <Text>Fecha: {data.generatedAt ?? new Date().toLocaleString()}</Text>
          <View style={styles.row}><Text>Sistema:</Text><Text>{data.system}</Text></View>
          <View style={styles.row}><Text>Largo (m):</Text><Text>{data.length_m}</Text></View>
          <View style={styles.row}><Text>Alto (m):</Text><Text>{data.height_m}</Text></View>
        </View>

        <Text style={styles.label}>Resultados</Text>

        <View style={styles.box}>
          <View style={styles.row}><Text>Área (m²)</Text><Text>{data.area_m2.toFixed(2)}</Text></View>
          <View style={styles.row}><Text>Bloques base</Text><Text>{data.blocks_base.toFixed(2)}</Text></View>
          <View style={styles.row}><Text>Merma (%)</Text><Text>{data.waste_pct.toFixed(0)}%</Text></View>
          <View style={styles.row}><Text>Bloques totales</Text><Text>{data.blocks_total.toFixed(2)}</Text></View>
        </View>

        <Text style={styles.footer}>
          ICF México — Construcción eficiente y sostenible — www.icfmexico.com
        </Text>
      </Page>
    </Document>
  );

  const instance = pdf();
  instance.updateContainer(doc);
  const buffer = await instance.toBuffer();
  return buffer;
}
