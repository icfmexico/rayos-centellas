import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { brand, docMeta } from "./theme";
import { t, type Lang } from "./i18n";

const styles = StyleSheet.create({
  page: { flexDirection: "column", paddingTop: 24, paddingBottom: 20, paddingHorizontal: 28, backgroundColor: brand.colors.bg },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottom: `1 solid ${brand.colors.border}`, paddingBottom: 8, marginBottom: 10 },
  logo: { width: 120, height: 28, objectFit: "contain" },
  titleBlock: { textAlign: "right" },
  title: { fontSize: 20, color: brand.colors.primary, fontWeight: 700 },
  subtitle: { fontSize: 10, color: brand.colors.soft, marginTop: 2 },
  section: { marginTop: 10 },
  h2: { fontSize: 12, color: brand.colors.primary, marginBottom: 6, fontWeight: 700 },
  p: { fontSize: 9, color: brand.colors.text, lineHeight: 1.35 },
  grid2: { flexDirection: "row", gap: 12 },
  col: { flex: 1 },
  card: { border: `1 solid ${brand.colors.border}`, borderRadius: 6, padding: 8, gap: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { fontSize: 9, color: brand.colors.soft },
  value: { fontSize: 9, color: brand.colors.text, fontWeight: 700 },
  footer: { marginTop: 10, fontSize: 8, color: brand.colors.soft, textAlign: "center" },
  pill: { alignSelf: "flex-start", backgroundColor: "#F5F7FB", color: brand.colors.accent, fontSize: 8, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 10, marginBottom: 6, border: `1 solid ${brand.colors.border}` },
});

type StrongTopInput = { peralte_cm?: 25; concreto_fc?: 200 | 250; area_m2?: number; };
const defaultInput: Required<StrongTopInput> = { peralte_cm: 25, concreto_fc: 200, area_m2: 100 };

export function StrongTopSpecPDF(props: { input?: StrongTopInput; logoData?: Uint8Array; lang?: Lang }) {
  const lang = props.lang || "es";
  const txt = t(lang);
  const i = { ...defaultInput, ...(props.input || {}) };
  // ⚓️ Peralte fijo 25 cm
  i.peralte_cm = 25;

  // 🔢 Volumetría oficial StrongTop
  const concreto_m3 = +(0.09 * i.area_m2).toFixed(2);   // 0.09 m³/m²
  const acero_kg = +(7 * i.area_m2).toFixed(1);         // referencial, ajustable cuando definas tabla

  return (
    <Document title={docMeta.title} author={docMeta.author}>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          {props.logoData ? <Image src={{ data: props.logoData, format: "png" }} style={styles.logo} /> : <View />}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>StrongTop — Losa Aislada</Text>
            <Text style={styles.subtitle}>
              {lang === "es" ? "Confort térmico-acústico · Rapidez de montaje · Ahorro energético" : "Thermal-acoustic comfort · Fast install · Energy savings"}
            </Text>
          </View>
        </View>

        {/* Intro */}
        <View style={[styles.section, styles.card]}>
          <Text style={styles.p}>
            <Text style={{ fontWeight: 700 }}>StrongTop</Text> {lang === "es"
              ? "es nuestro sistema de losa aislada para entrepisos y techos."
              : "is our insulated slab system for floors and roof decks."}{" "}
            {lang === "es"
              ? "Para la app usaremos peralte fijo de"
              : "In the app we will use a fixed depth of"}{" "}
            25 {lang === "es" ? "cm" : "cm"}.
          </Text>
        </View>

        {/* Datos rápidos */}
        <View style={[styles.section, styles.grid2]}>
          <View style={[styles.col, styles.card]}>
            <Text style={styles.pill}>{lang === "es" ? "ESPECIFICACIONES RÁPIDAS" : "QUICK SPECS"}</Text>
            <View style={styles.row}><Text style={styles.label}>{lang === "es" ? "Peralte" : "Depth"}</Text><Text style={styles.value}>25 cm</Text></View>
            <View style={styles.row}><Text style={styles.label}>{lang === "es" ? "Concreto" : "Concrete"}</Text><Text style={styles.value}>fc {i.concreto_fc} kg/cm²</Text></View>
            <View style={styles.row}><Text style={styles.label}>{lang === "es" ? "Área" : "Area"}</Text><Text style={styles.value}>{i.area_m2} m²</Text></View>
          </View>

          <View style={[styles.col, styles.card]}>
            <Text style={styles.pill}>{lang === "es" ? "VOLUMETRÍA" : "QUANTITIES"}</Text>
            <View style={styles.row}><Text style={styles.label}>{lang === "es" ? "Concreto" : "Concrete"}</Text><Text style={styles.value}>{concreto_m3} m³</Text></View>
            <View style={styles.row}><Text style={styles.label}>{lang === "es" ? "Acero (ref.)" : "Rebar (ref.)"}</Text><Text style={styles.value}>{acero_kg} kg</Text></View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>© {new Date().getFullYear()} ICF MEXICO · www.icfmexico.com · info@icfmexico.com</Text>
        </View>
      </Page>
    </Document>
  );
}
