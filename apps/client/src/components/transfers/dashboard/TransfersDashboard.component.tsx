import PreLoader from "@/components/PreLoader.component.tsx";
import store from "@/store.ts";
import { formatPriceUAH } from "@/utils/formatPrice.utils.ts";
import { action, makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";

const TransfersDashboardGrid = React.lazy(() => import("@/components/transfers/dashboard/TransfersDashboardGrid.component"));

interface IProps {}

class TransfersDashboard extends React.Component<IProps> {
	selectedX!: keyof ITransfersPrepare;
	selectedY!: Array<keyof ITransferStatBlockValues>;

	constructor(props: IProps) {
		super(props);

		makeObservable(this, {
			selectedX: observable,
			onUpdateX: action,
			selectedY: observable,
			onUpdateDataTypes: action,
		});

		try {
			const selectedX: keyof ITransfersPrepare = JSON.parse(window.localStorage.getItem("transfers:selectedX")!);
			const selectedY: Array<keyof ITransferStatBlockValues> = JSON.parse(window.localStorage.getItem("transfers:selectedY")!);
			// @ts-ignore
			runInAction(() => {
				this.selectedX = selectedX || this.xLabelsTypes[0];
				this.selectedY = selectedY || [this.dataTypes[0]];
			});
		} catch (e: any) {
			console.error(e);
		}
	}

	get chartData(): ILineChartData {
		const transferStatBlock = store.transfers.data[this.selectedX] as ITransferStatBlock;
		return {
			series: this.selectedY.map(selectedDataType => ({
				name: `Transfers ${selectedDataType} for ${this.selectedX}`,
				type: "line",
				smooth: false,
				data: transferStatBlock.values[selectedDataType],
				symbol: "none",
				dataType: selectedDataType,
			})),
			xAxisData: transferStatBlock.labels,
			minY: 0,
			maxY: Math.round(
				this.selectedY.reduce((res, selectedDataType) => {
					const max = Math.max(...transferStatBlock.values[selectedDataType]);
					return Math.max(res, max);
				}, 0),
			),
		};
	}

	get xLabelsTypes() {
		// @ts-ignore
		const [count, ...xLabelsTypes] = Object.keys(store.transfers.data);
		return xLabelsTypes as (keyof ITransfersPrepare)[];
	}

	get dataTypes(): (keyof ITransferStatBlockValues)[] {
		const transferStatBlock = store.transfers.data[this.selectedX] as ITransferStatBlock;
		return Object.keys(transferStatBlock?.values || {}) as (keyof ITransferStatBlockValues)[];
	}

	formatY = (value: number, seriesIndex: number) => {
		const dataType = this.chartData.series[seriesIndex].dataType;
		switch (dataType) {
			case "price_avg":
			case "price_min":
			case "price_max":
				return formatPriceUAH(value);
			case "percent":
				return `${value}%`;
			default:
				return value;
		}
	};

	onUpdateX = (e: any) => {
		this.selectedX = e.target.value;
		// Save LS
		window.localStorage.setItem("transfers:selectedX", JSON.stringify(this.selectedX));
	};

	onUpdateDataTypes = (e: React.ChangeEvent<HTMLSelectElement>) => {
		// Get all selected options
		const options = e.target.options;
		const selectedValues: Array<keyof ITransferStatBlockValues> = [];

		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) selectedValues.push(options[i].value as keyof ITransferStatBlockValues);
		}

		this.selectedY = selectedValues;

		// Save to localStorage
		window.localStorage.setItem("transfers:selectedY", JSON.stringify(this.selectedY));
	};

	render() {
		// TODO: Currencies
		// TODO: Make part of each chart
		// TODO: Implement react grid layout
		// TODO: We need ability to see what transfers we show, like table,
		//  because sometimes data is confused, so we need to see table
		return (
			<div className="p-2 pl-0 min-h-full w-full flex flex-col">
				{/*<div className=":bordered p-2 mb-2">*/}
				{/*	<Select*/}
				{/*		label={<T>Choose X axis value</T>}*/}
				{/*		value={this.selectedX as string}*/}
				{/*		onChange={this.onUpdateX}*/}
				{/*		options={this.xLabelsTypes.map(dataType => ({*/}
				{/*			value: dataType,*/}
				{/*			label: dataType,*/}
				{/*		}))}*/}
				{/*	/>*/}

				{/*	<div className="mt-2">*/}
				{/*		<Select*/}
				{/*			isMulti*/}
				{/*			style={{ height: this.dataTypes.length * 21 }}*/}
				{/*			label={<T>Choose Y axis values</T>}*/}
				{/*			value={this.selectedY as readonly string[]}*/}
				{/*			onChange={this.onUpdateDataTypes}*/}
				{/*			options={this.dataTypes.map(dataType => ({*/}
				{/*				value: dataType,*/}
				{/*				label: dataType,*/}
				{/*			}))}*/}
				{/*		/>*/}
				{/*	</div>*/}
				{/*</div>*/}

				<TransfersDashboardGrid />
			</div>
		);
	}
}

export default observer(TransfersDashboard);
