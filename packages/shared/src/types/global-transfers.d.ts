export {};

declare global {
	interface ITransferStatBlockValues {
		count: number[];
		percent: number[];
		price_max: number[];
		price_avg: number[];
		price_min: number[];
	}

	interface ITransferStatBlock {
		labels: (string | number)[];
		values: ITransferStatBlockValues;
	}

	interface ITransfersPrepare {
		country: ITransferStatBlock;
		height: ITransferStatBlock;
		weekday: ITransferStatBlock;
		week: ITransferStatBlock;
		hour: ITransferStatBlock;
		age: ITransferStatBlock;
		count: number;
	}

	interface ITransferGridItemModelArguments {
		i: string;
		x: number;
		w: number;
		h: number;
		chartType: TChartType;
		selectedX: keyof ITransfersPrepare;
		selectedY: Array<keyof ITransferStatBlockValues>;
	}
}
