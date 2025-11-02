// src/pdf/joist/theme.ts
export const brand = {
  fonts: {
    base: "Helvetica",
    size: { title: 20, subtitle: 10, h2: 12, body: 9, small: 8, pill: 8 },
    weight: { normal: 400, semibold: 600, bold: 700 },
    line: { tight: 1.25, normal: 1.35 },
  },
  colors: {
    primary: "#0A2A66",
    accent:  "#D72638",
    text:    "#1B1F23",
    soft:    "#6B7280",
    border:  "#E5E7EB",
    bg:      "#FFFFFF",
    pillBg:  "#F9FAFB",
  },
  layout: {
    page: { padX: 28, padTop: 24, padBottom: 20 },
    card: { radius: 8, pad: 10, gap: 6, border: 1 },
    gridGap: 12,
    rowGap: 4,
  },
  footer: {
    text: (year: number) =>
      `© ${year} ICF MEXICO · www.icfmexico.com · info@icfmexico.com`,
  },
};

export const docMeta = {
  title: "ICF MEXICO",
  author: "ICF MEXICO",
  subject: "Ficha técnica — Joist",
};
