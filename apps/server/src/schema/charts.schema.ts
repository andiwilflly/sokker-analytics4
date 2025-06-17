export const chartTypes = ["line", "bar", "pie"] as const;

export type TChartType = (typeof chartTypes)[number];

export type TPIEChartData = {
	name: string;
	value: number;
}[];
