import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { brand, docMeta } from "./theme";
import { t, type Lang } from "./i18n";

const styles = StyleSheet.create({
  page: { flexDirection: "column", paddingTop: 24, paddingBottom: 20, paddingHorizontal: 28, backgroundColor: brand.colors.bg },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottom: `1 solid ${brand.colors.border}`, paddingBottom: 8, marginBottom: 10 },
  logo: { width: 180, height: 40, objectFit: "contain" },
  titleBlock: { textAlign: "right" },
  title: { fontSize: 20, color: brand.colors.primary, fontWeight: 700 },
  subtitle: { fontSize: 10, color: brand.colors.soft, marginTop: 2 },
  section: { marginTop: 10 },
  h2: { fontSize: 12, color: brand.colors.primary, marginBottom: 6, fontWeight: 700 },
  p: { fontSize: 9, color: brand.colors.text, lineHeight: 1.35 },
  grid2: { flexDirection: "row", gap: 12 },
  col: { flex: 1 },
  card: { border: `1 solid ${brand.colors.border}`, borderRadius: 8, padding: 10, gap: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { fontSize: 9, color: brand.colors.soft },
  value: { fontSize: 9, color: brand.colors.text, fontWeight: 700 },
  table: { border: `1 solid ${brand.colors.border}`, borderRadius: 6, overflow: "hidden" },
  tr: { flexDirection: "row" },
  th: { flex: 1, backgroundColor: "#F5F7FB", borderRight: `1 solid ${brand.colors.border}`, padding: 6, fontSize: 9, color: brand.colors.primary, fontWeight: 700 },
  td: { flex: 1, borderTop: `1 solid ${brand.colors.border}`, borderRight: `1 solid ${brand.colors.border}`, padding: 6, fontSize: 9, color: brand.colors.text },
  footer: { marginTop: 10, fontSize: 8, color: brand.colors.soft, textAlign: "center" },
  pill: { alignSelf: "flex-start", backgroundColor: "#F5F7FB", color: brand.colors.accent, fontSize: 8, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 10, marginBottom: 6, border: `1 solid ${brand.colors.border}` },
});

type MakrosInput = { peralte_cm?: 18 | 20 | 25 | 29 | 32; concreto_fc?: 200 | 250; area_m2?: number; };
const defaultInput: Required<MakrosInput> = { peralte_cm: 27 as any, concreto_fc: 200, area_m2: 100 };

export function MakrosSpecPDF(props: { input?: MakrosInput; logoData?: Uint8Array; lang?: Lang }) {
  const lang = props.lang || "es";
  const txt = t(lang);
  const i = { ...defaultInput, ...(props.input || {}) };

  const posibles = [18, 20, 25, 29, 32];
  const peralte = posibles.reduce((prev, curr) =>
    Math.abs((i.peralte_cm as number) - curr) < Math.abs((i.peralte_cm as number) - prev) ? curr : prev
  , posibles[0]);

  const FACTOR_CONCRETO_M3_POR_M2: Record<number, number> = {
    18: 0.083,
    20: 0.091,
    25: 0.103,
    29: 0.114,
    32: 0.121,
  };
  const factor = FACTOR_CONCRETO_M3_POR_M2[peralte] ?? 0.103;
  const concreto_m3 = +(factor * i.area_m2).toFixed(2);
  const acero_kg = +(10 * i.area_m2).toFixed(1);

  return (
    <Document title={docMeta.title} author={docMeta.author} subject="Makros — Ficha técnica">
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        <View style={styles.headerRow}>
          {props.logoData ? <Image src={{ data: props.logoData, format: "png" }} style={styles.logo} /> : <View />}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{txt.headerTitle}</Text>
            <Text style={styles.subtitle}>{txt.headerSub}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.card]}>
          <Text style={styles.p}>
            <Text style={{ fontWeight: 700 }}>{txt.intro1A}</Text> {txt.intro1B} {txt.intro1C} {peralte} {txt.cm} {txt.intro1D}
          </Text>
        </View>

        <View style={[styles.section, styles.grid2]}>
          <View style={[styles.col, styles.card]}>
            <Text style={styles.pill}>{txt.specsQuick}</Text>
            <View style={styles.row}><Text style={styles.label}>{txt.peralte}</Text><Text style={styles.value}>{peralte} {txt.cm}</Text></View>
            <View style={styles.row}><Text style={styles.label}>{txt.concreto}</Text><Text style={styles.value}>{txt.fcUnit(i.concreto_fc)}</Text></View>
            <View style={styles.row}><Text style={styles.label}>{txt.area}</Text><Text style={styles.value}>{i.area_m2} {txt.m2}</Text></View>
          </View>

          <View style={[styles.col, styles.card]}>
            <Text style={styles.pill}>{txt.volumetria}</Text>
            <View style={styles.row}><Text style={styles.label}>{txt.concretoTotal}</Text><Text style={styles.value}>{concreto_m3} {txt.m3}</Text></View>
            <View style={styles.row}><Text style={styles.label}>{txt.aceroEstimado}</Text><Text style={styles.value}>{acero_kg} {txt.kg}</Text></View>
          </View>
        </View>

        <View style={[styles.section]}>
          <Text style={styles.h2}>{txt.variantes}</Text>
          <View style={styles.table}>
            <View style={styles.tr}>
              <Text style={styles.th}>{txt.peralte}</Text>
              <Text style={styles.th}>{txt.concreto}</Text>
              <Text style={styles.th}>{txt.observaciones}</Text>
            </View>
            {[18, 20, 25, 29, 32].map((p, idx) => (
              <View key={idx} style={styles.tr}>
                <Text style={styles.td}>{p} {txt.cm}</Text>
                <Text style={styles.td}>{FACTOR_CONCRETO_M3_POR_M2[p]} {txt.m3}/{txt.m2}</Text>
                <Text style={styles.td}>
                  {p === 25 ? (lang === "es" ? "Selección típica vivienda" : "Typical housing choice")
                  : p === 32 ? (lang === "es" ? "Mayor rigidez y luces" : "More stiffness/spans")
                  : (lang === "es" ? "Según diseño" : "Per design")}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text>{txt.footer(new Date().getFullYear())}</Text>
        </View>
      </Page>
    </Document>
  );
}
