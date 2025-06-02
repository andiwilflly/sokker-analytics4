import PreLoader from "@/components/PreLoader.component.tsx";
import T from "@/components/T.component.tsx";
import TransfersDashboardItemModal from "@/components/transfers/dashboard/TransfersDashboardItemModal.component.tsx";
import store from "@/store.ts";
import { formatPriceUAH } from "@shared/utils/formatPrice.utils.ts";
import { CircleX, Settings } from "lucide-react";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";

const LazyLineChart = React.lazy(() => import("@/components/charts/LineChart.component.tsx"));

interface IProps {
	i: string;
	width: number;
	height: number;
}

class TransfersDashboardItem extends React.Component<IProps> {
	titleHeight = 25;
	padding = 10;

	isEditModalOpen = false;

	constructor(props: IProps) {
		super(props);

		makeObservable(this, {
			isEditModalOpen: observable,
		});
	}

	get item() {
		return store.transfers.grid.all.get(this.props.i)!;
	}

	get chartData(): ILineChartData {
		const transferStatBlock = store.transfers.data[this.item.selectedX] as ITransferStatBlock;
		return {
			series: this.item.selectedY.map(selectedDataType => ({
				name: `Transfers ${selectedDataType} for ${this.item.selectedX}`,
				type: "line",
				smooth: false,
				data: transferStatBlock.values[selectedDataType],
				symbol: "none",
				dataType: selectedDataType,
			})),
			xAxisData: transferStatBlock.labels,
			minY: 0,
			maxY: Math.round(
				this.item.selectedY.reduce((res, selectedDataType) => {
					const max = Math.max(...transferStatBlock.values[selectedDataType]);
					return Math.max(res, max);
				}, 0),
			),
		};
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

	render() {
		if (!this.item) return "[no such widget]";

		return (
			<div className=":grid-item text-xs :bordered" style={{ width: this.props.width, height: this.props.height }}>
				<div className=":grid-title flex justify-between">
					<div className=":grid-draggable-handler overflow-hidden text-ellipsis whitespace-nowrap">
						<T>Transfers per</T>
						&nbsp;<span className="text-orange-600">{this.item.selectedX}</span>
						&nbsp;<T>for</T>
						&nbsp;<span className="text-blue-700">{this.item.selectedY.join(", ")}</span>
					</div>

					<div className="flex mr-1">
						<button
							onClick={() => {
								runInAction(() => (this.isEditModalOpen = true));
							}}
							className="cursor-pointer text-white mr-2">
							<Settings className="text-white" size={17} />
						</button>

						<button onClick={() => store.transfers.grid.removeItem(this.props.i)} className="cursor-pointer text-white">
							<CircleX className="text-red-700" size={18} />
						</button>
					</div>
				</div>

				<LazyLineChart
					width={this.props.width - this.padding * 2}
					height={this.props.height - (this.titleHeight + this.padding * 2)}
					chartData={this.chartData}
					reactionString={store.isLoading + this.item.selectedY.join() + this.item.selectedX}
					formatY={this.formatY}
				/>

				{store.isLoading ? (
					<div className="fixed inset-0 pointer-events-none flex items-center justify-center">
						<PreLoader />
					</div>
				) : null}

				{this.isEditModalOpen &&
					ReactDOM.createPortal(
						<TransfersDashboardItemModal i={this.props.i} onClose={() => runInAction(() => (this.isEditModalOpen = false))} />,
						window.document.getElementById("modal-container")!,
					)}
			</div>
		);
	}
}

export default observer(TransfersDashboardItem);
