import React from "react";
import { Document, Page, View, Text, StyleSheet, pdf, Image } from "@react-pdf/renderer";
import fs from "node:fs";
import path from "node:path";

export type PdfData = {
  system: string;
  length_m: number;
  height_m: number;
  waste_pct: number;
  area_m2: number;
  blocks_base: number;
  blocks_total: number;
  lang?: "es" | "en";
  generatedAt?: string;
};

const COLORS = {
  blue: "#002B7F",
  red: "#E41B13",
  text: "#222",
  muted: "#666",
  border: "#DDDFE3",
  bg: "#F8F9FB",
};

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 12, fontFamily: "Helvetica", backgroundColor: "#FFFFFF" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titleBox: { textAlign: "right" },
  title: { fontSize: 16, fontWeight: 700, color: COLORS.blue },
  subtitle: { fontSize: 10, color: COLORS.muted },
  divider: { marginTop: 8, height: 3, backgroundColor: COLORS.blue, borderRadius: 2 },

  sectionTitle: { marginTop: 14, marginBottom: 6, fontSize: 12, fontWeight: 700, color: COLORS.text },
  card: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 12, backgroundColor: "#fff" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  label: { color: COLORS.muted },
  value: { fontWeight: 700 },

  footer: { marginTop: 18, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footText: { fontSize: 9, color: COLORS.muted },
});

function readPublicBase64(name: string) {
  const p = path.join(process.cwd(), "public", name);
  const buf = fs.readFileSync(p);
  return `data:image/${name.endsWith(".svg") ? "svg+xml" : "png"};base64,${buf.toString("base64")}`;
}

export async function generatePdfBuffer(data: PdfData) {
  const lang = data.lang ?? "es";
  const headLogo = lang === "en" ? "en-icf-logo.png" : "es-icf-logo.png";
  const footLogo = lang === "en" ? "en-icf-logo-footer.png" : "es-icf-logo-footer.png";

  const headLogoSrc = readPublicBase64(headLogo);
  const footLogoSrc = readPublicBase64(footLogo);

  const title = lang === "en" ? "ICF MEXICO — Pro Calculator" : "ICF MÉXICO — Calculadora Pro";
  const summary = lang === "en" ? "Calculation Summary" : "Resumen del cálculo";
  const results = lang === "en" ? "Results" : "Resultados";
  const lblArea = lang === "en" ? "Area (m²)" : "Área (m²)";
  const lblBase = lang === "en" ? "Base blocks" : "Bloques base";
  const lblWaste = lang === "en" ? "Waste (%)" : "Merma (%)";
  const lblTotal = lang === "en" ? "Total blocks" : "Bloques totales";
  const madeBy = lang === "en"
    ? "ICF Mexico — Efficient & sustainable construction — www.icfmexico.com"
    : "ICF México — Construcción eficiente y sostenible — www.icfmexico.com";

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Image src={headLogoSrc} style={{ height: 36, width: 160 }} />
          <View style={styles.titleBox}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{data.generatedAt ?? new Date().toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Summary */}
        <Text style={styles.sectionTitle}>{summary}</Text>
        <View style={styles.card}>
          <View style={styles.row}><Text className="label">Sistema</Text><Text style={styles.value}>{data.system}</Text></View>
          <View style={styles.row}><Text style={styles.label}>{lang==="en"?"Length (m)":"Largo (m)"}</Text><Text style={styles.value}>{data.length_m}</Text></View>
          <View style={styles.row}><Text style={styles.label}>{lang==="en"?"Height (m)":"Alto (m)"}</Text><Text style={styles.value}>{data.height_m}</Text></View>
        </View>

        {/* Results */}
        <Text style={styles.sectionTitle}>{results}</Text>
        <View style={styles.card}>
          <View style={styles.row}><Text style={styles.label}>{lblArea}</Text><Text style={styles.value}>{data.area_m2.toFixed(2)}</Text></View>
          <View style={styles.row}><Text style={styles.label}>{lblBase}</Text><Text style={styles.value}>{data.blocks_base.toFixed(2)}</Text></View>
          <View style={styles.row}><Text style={styles.label}>{lblWaste}</Text><Text style={styles.value}>{data.waste_pct.toFixed(0)}%</Text></View>
          <View style={styles.row}><Text style={styles.label}>{lblTotal}</Text><Text style={styles.value}>{data.blocks_total.toFixed(2)}</Text></View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Image src={footLogoSrc} style={{ height: 20, width: 120 }} />
          <Text style={styles.footText}>{madeBy}</Text>
        </View>
      </Page>
    </Document>
  );

  const instance = pdf();
  instance.updateContainer(doc);
  const buffer = await instance.toBuffer();
  return buffer;
}
