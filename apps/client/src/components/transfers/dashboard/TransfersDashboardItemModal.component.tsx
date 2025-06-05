import T from "@/components/T.component.tsx";
import ChartTypeRenderer from "@/components/charts/ChartTypeRenderer.component.tsx";
import Select from "@/components/elements/Select.component.tsx";
import type GridItemModel from "@/models/transfers/grid/GridItem.model.ts";
import store from "@/store";
import { type TChartType, chartTypes } from "@shared/schema/charts.schema.ts";
import { observer } from "mobx-react";
import type { Instance } from "mobx-state-tree";
import React from "react";

interface IProps {
	i: string;
	onClose: () => void;
}

class TransfersDashboardItemModal extends React.Component<IProps> {
	get item(): Instance<typeof GridItemModel> {
		return store.transfers.grid.all.get(this.props.i)!;
	}

	render() {
		return (
			<div className="z-1000 fixed inset-0 flex items-center justify-center">
				{/* Backdrop */}
				<div className="fixed inset-0 bg-black opacity-70" onClick={this.props.onClose} />

				{/* Modal container */}
				<div
					className="bg-white z-1000 relative rounded-lg shadow-xl p-4 overflow-hidden"
					style={{ width: "90vw", height: "90vh" }}>
					<h2 className="text-lg font-semibold mb-4">
						<T>Settings</T>
					</h2>

					{/* Modal content */}
					<div className="flex flex-wrap content-start gap-2 overflow-y-auto h-[calc(90vh-9rem)]">
						<div className=":bordered p-2 mb-2">
							<ChartTypeRenderer isChartsConnect={false} i={this.props.i} width={400} height={200} />
						</div>
						<div>
							<Select
								label={<T>Choose chart type</T>}
								value={this.item.chartType as TChartType}
								onChange={(e: any) => this.item.update({ chartType: e.target.value })}
								options={chartTypes.map(chartType => ({
									value: chartType,
									label: chartType,
								}))}
							/>

							<Select
								label={<T>Choose X axis value</T>}
								value={this.item.selectedX as string}
								onChange={(e: any) => this.item.update({ selectedX: e.target.value })}
								options={this.item.xLabelsTypes.map(dataType => ({
									value: dataType,
									label: dataType,
								}))}
							/>

							<div className="mt-2">
								<Select
									isMulti
									style={{ height: this.item.yLabelsTypes.length * 21 }}
									label={<T>Choose Y axis values</T>}
									value={this.item.selectedY as readonly string[]}
									onChange={e => {
										const options = e.target.options;
										const selectedYValues: Array<keyof ITransferStatBlockValues> = [];

										for (let i = 0; i < options.length; i++) {
											if (options[i].selected) {
												selectedYValues.push(options[i].value as keyof ITransferStatBlockValues);
											}
										}

										this.item.update({ selectedY: selectedYValues });
									}}
									options={this.item.yLabelsTypes.map(dataType => ({
										value: dataType,
										label: dataType,
									}))}
								/>
							</div>
						</div>
					</div>

					<div className="mt-4 text-right">
						<button
							onClick={this.props.onClose}
							className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-4 rounded">
							<T>Apply</T>
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default observer(TransfersDashboardItemModal);
