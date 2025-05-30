import type { ITransferStatBlockValues } from "@/types/global-transfers";

export {};

declare global {
	interface ILineChartData {
		series: ILineChartDataSerie[];
		xAxisData: (string | number)[];
		minY: number;
		maxY: number;
	}

	interface ILineChartDataSerie {
		name: string;
		type: "line";
		data: (number | number[])[];
		smooth: boolean;
		symbol: "none";
		dataType: keyof ITransferStatBlockValues;
	}
}
