export const chartTypes = ["line", "bar"] as const;

export type TChartType = (typeof chartTypes)[number];
