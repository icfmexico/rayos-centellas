export type WallSystem = "ICF-15" | "ICF-20" | "SOLID";

const BLOCKS_PER_M2: Record<WallSystem, number> = {
  "ICF-15": 2.77,   // bloques por m² (reticular)
  "ICF-20": 3.33,   // bloques por m² (reticular)
  SOLID: 2.0        // bloques por m² (pared sólida)
};

export type ProInput = {
  system: WallSystem;
  length_m: number;
  height_m: number;
  waste_pct?: number; // 0–100
};

export type ProResult = {
  area_m2: number;
  blocks_base: number;
  waste_pct: number;
  blocks_total: number;
};

export function computePro(input: ProInput): ProResult {
  const { system, length_m, height_m } = input;
  const waste_pct = Math.max(0, Math.min(100, input.waste_pct ?? 5));
  const area_m2 = Math.max(0, length_m) * Math.max(0, height_m);
  const blocks_base = area_m2 * BLOCKS_PER_M2[system];
  const blocks_total = blocks_base * (1 + waste_pct / 100);

  return {
    area_m2,
    blocks_base,
    waste_pct,
    blocks_total,
  };
}
