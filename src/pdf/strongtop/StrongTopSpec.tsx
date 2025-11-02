import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Link } from "@react-pdf/renderer";
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
  table: { border: `1 solid ${brand.colors.border}`, borderRadius: 6, overflow: "hidden" },
  tr: { flexDirection: "row" },
  th: { flex: 1, backgroundColor: "#F5F7FB", borderRight: `1 solid ${brand.colors.border}`, padding: 6, fontSize: 9, color: brand.colors.primary, fontWeight: 700 },
  td: { flex: 1, borderTop: `1 solid ${brand.colors.border}`, borderRight: `1 solid ${brand.colors.border}`, padding: 6, fontSize: 9, color: brand.colors.text },
  footer: { marginTop: 10, fontSize: 8, color: brand.colors.soft, textAlign: "center" },
  pill: { alignSelf: "flex-start", backgroundColor: "#F5F7FB", color: brand.colors.accent, fontSize: 8, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 10, marginBottom: 6, border: `1 solid ${brand.colors.border}` },
});

type StrongTopInput = { peralte_cm?: 27 | 30 | 32; concreto_fc?: 200 | 250; area_m2?: number; };
const defaultInput: Required<StrongTopInput> = { peralte_cm: 27, concreto_fc: 200, area_m2: 100 };

function calcVolumenConcretoM3(area_m2: number, peralte_cm: number) {
  const espesorEquivalente_m = (peralte_cm / 100) * 0.12;
  return +(area_m2 * espesorEquivalente_m).toFixed(3);
}
function calcAceroKg(area_m2: number) { return +(area_m2 * 4.5).toFixed(1); }

export function StrongTopSpecPDF(props: { input?: StrongTopInput; logoData?: Uint8Array; lang?: Lang }) {
  const i = { ...defaultInput, ...(props.input || {}) };
  const txt = t(props.lang || "es");
  const volumenM3 = calcVolumenConcretoM3(i.area_m2, i.peralte_cm);
  const aceroKg = calcAceroKg(i.area_m2);

  return (
    <Document title={txt.docTitle} author="ICF MEXICO" subject="Ficha técnica StrongTop">
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          {props.logoData ? <Image src={{ data: props.logoData, format: "png" }} style={styles.logo} /> : <View />}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{txt.headerTitle}</Text>
            <Text style={styles.subtitle}>{txt.headerSub}</Text>
          </View>
        </View>

        {/* Intro */}
        <View style={[styles.section, styles.card]}>
          <Text style={styles.p}>
            <Text style={{ fontWeight: 700 }}>{txt.intro1A}</Text> {txt.intro1B} {txt.intro1C} {i.peralte_cm} {txt.cm} {txt.intro1D}
          </Text>
        </View>

        {/* Datos rápidos */}
        <View style={[styles.section, styles.grid2]}>
          <View style={[styles.col, styles.card]}>
            <Text style={styles.pill}>{txt.specsQuick}</Text>
            <View style={styles.row}><Text style={styles.label}>{txt.peralte}</Text><Text style={styles.value}>{i.peralte_cm} {txt.cm}</Text></View>
            <View style={styles.row}><Text style={styles.label}>{txt.concreto}</Text><Text style={styles.value}>{txt.fcUnit(i.concreto_fc)}</Text></View>
            <View style={styles.row}><Text style={styles.label}>{txt.area}</Text><Text style={styles.value}>{i.area_m2} {txt.m2}</Text></View>
          </View>
          <View style={[styles.col, styles.card]}>
            <Text style={styles.pill}>{txt.volumetria}</Text>
            <View style={styles.row}><Text style={styles.label}>{txt.concretoTotal}</Text><Text style={styles.value}>{volumenM3} {txt.m3}</Text></View>
            <View style={styles.row}><Text style={styles.label}>{txt.aceroEstimado}</Text><Text style={styles.value}>{aceroKg} {txt.kg}</Text></View>
          </View>
        </View>

        {/* Tabla */}
        <View style={[styles.section]}>
          <Text style={styles.h2}>{txt.variantes}</Text>
          <View style={styles.table}>
            <View style={styles.tr}>
              <Text style={styles.th}>{txt.peralte}</Text>
              <Text style={styles.th}>{txt.usoTipico}</Text>
              <Text style={styles.th}>{txt.observaciones}</Text>
            </View>
            {[
              { p: "27 cm", uso: txt.v27uso, obs: txt.v27obs },
              { p: "30 cm", uso: txt.v30uso, obs: txt.v30obs },
              { p: "32 cm", uso: txt.v32uso, obs: txt.v32obs },
            ].map((r, idx) => (
              <View key={idx} style={styles.tr}>
                <Text style={styles.td}>{r.p}</Text>
                <Text style={styles.td}>{r.uso}</Text>
                <Text style={styles.td}>{r.obs}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{txt.footer(new Date().getFullYear())}</Text>
        </View>
      </Page>
    </Document>
  );
}
