import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { brand, docMeta } from "./theme";
import { t, type Lang } from "./i18n";

const styles = StyleSheet.create({
  page: { flexDirection: "column", paddingTop: 24, paddingBottom: 20, paddingHorizontal: 28, backgroundColor: brand.colors.bg },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottom: `1 solid ${brand.colors.border}`, paddingBottom: 8, marginBottom: 10 },
  logo: { width: 180, height: 40, objectFit: "contain" },
  titleBlock: { textAlign: "right" },
  title: { fontSize: brand.fonts.size.title, color: brand.colors.primary, fontWeight: brand.fonts.weight.bold },
  subtitle: { fontSize: brand.fonts.size.subtitle, color: brand.colors.soft, marginTop: 2 },
  section: { marginTop: 10 },
  h2: { fontSize: brand.fonts.size.h2, color: brand.colors.primary, marginBottom: 6, fontWeight: brand.fonts.weight.bold },
  p: { fontSize: brand.fonts.size.body, color: brand.colors.text, lineHeight: brand.fonts.line.normal },
  grid2: { flexDirection: "row", gap: brand.layout.gridGap },
  col: { flex: 1 },
  card: { border: `1 solid ${brand.colors.border}`, borderRadius: brand.layout.card.radius, padding: brand.layout.card.pad, gap: brand.layout.card.gap },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: brand.layout.rowGap },
  label: { fontSize: brand.fonts.size.body, color: brand.colors.soft },
  value: { fontSize: brand.fonts.size.body, color: brand.colors.text, fontWeight: brand.fonts.weight.bold },
  note: { fontSize: brand.fonts.size.small, color: "#666" },
  footer: { marginTop: 10, fontSize: brand.fonts.size.small, color: brand.colors.soft, textAlign: "center" },
  pill: { alignSelf: "flex-start", backgroundColor: brand.colors.pillBg, color: brand.colors.accent, fontSize: brand.fonts.size.pill, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 10, marginBottom: 6, border: `1 solid ${brand.colors.border}` },
});

type JoistInput = { peralte_cm?: 25; concreto_fc?: 200 | 250; area_m2?: number; };
const defaultInput: Required<JoistInput> = { peralte_cm: 25, concreto_fc: 200, area_m2: 100 };

export function JoistSpecPDF(props: { input?: JoistInput; logoData?: Uint8Array; lang?: Lang }) {
  const lang = props.lang || "es";
  const txt = t(lang);
  const i = { ...defaultInput, ...(props.input || {}) };
  // Peralte fijo 25 cm en la app
  i.peralte_cm = 25;

  // Volumetría (25 cm): 0.022 m³/m² nervaduras + 0.05 m³/m² capa 5 cm = 0.072 m³/m²
  const JOIST_CONCRETO_M3_POR_M2 = 0.072;
  const concreto_m3 = +(JOIST_CONCRETO_M3_POR_M2 * i.area_m2).toFixed(2);
  const acero_kg = +(8 * i.area_m2).toFixed(1); // referencial

  return (
    <Document title={docMeta.title} author={docMeta.author} subject="Joist — Ficha técnica">
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          {props.logoData ? <Image src={{ data: props.logoData, format: "png" }} style={styles.logo} /> : <View />}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Joist — Losa con Viguetas</Text>
            <Text style={styles.subtitle}>
              {lang === "es" ? "Montaje rápido · Rigidez · Capa de compresión 5 cm" : "Fast install · Stiffness · 5 cm topping"}
            </Text>
          </View>
        </View>

        {/* Intro */}
        <View style={[styles.section, styles.card]}>
          <Text style={styles.p}>
            <Text style={{ fontWeight: brand.fonts.weight.bold }}>Joist</Text>{" "}
            {lang === "es"
              ? "utiliza viguetas y una capa de compresión para luces típicas de vivienda. En la app el peralte es fijo de 25 cm."
              : "uses joists with a concrete topping for typical housing spans. In the app the depth is fixed at 25 cm."}
          </Text>
        </View>

        {/* Datos rápidos + Volumetría */}
        <View style={[styles.section, styles.grid2]}>
          <View style={[styles.col, styles.card]}>
            <Text style={styles.pill}>{lang === "es" ? "ESPECIFICACIONES RÁPIDAS" : "QUICK SPECS"}</Text>
            <View style={styles.row}><Text style={styles.label}>{lang === "es" ? "Peralte" : "Depth"}</Text><Text style={styles.value}>25 cm</Text></View>
            <View style={styles.row}><Text style={styles.label}>{lang === "es" ? "Concreto" : "Concrete"}</Text><Text style={styles.value}>fc {i.concreto_fc} kg/cm²</Text></View>
            <View style={styles.row}><Text style={styles.label}>{lang === "es" ? "Área" : "Area"}</Text><Text style={styles.value}>{i.area_m2} m²</Text></View>
          </View>

          <View style={[styles.col, styles.card]}>
            <Text style={styles.pill}>{lang === "es" ? "VOLUMETRÍA" : "QUANTITIES"}</Text>
            <View style={styles.row}><Text style={styles.label}>{lang === "es" ? "Concreto (total)" : "Concrete (total)"}</Text><Text style={styles.value}>{concreto_m3} m³</Text></View>
            <View style={styles.row}><Text style={styles.label}>{lang === "es" ? "Acero (ref.)" : "Rebar (ref.)"}</Text><Text style={styles.value}>{acero_kg} kg</Text></View>
          </View>
        </View>

        {/* Nota */}
        <View style={[styles.section, styles.card]}>
          <Text style={styles.note}>
            {lang === "es"
              ? "Nota: 0.022 m³/m² en nervaduras + 0.05 m³/m² en la capa de compresión (5 cm). Ajustes dependen del diseño estructural."
              : "Note: 0.022 m³/m² in ribs + 0.05 m³/m² in the 5 cm topping. Adjustments depend on structural design."}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{brand.footer.text(new Date().getFullYear())}</Text>
        </View>
      </Page>
    </Document>
  );
}
