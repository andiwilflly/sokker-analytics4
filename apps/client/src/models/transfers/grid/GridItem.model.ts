import { GRID_ITEM_MIN_HEIGHT, GRID_ITEM_MIN_WIDTH } from "@/CONSTANTS.ts";
import CoreModel from "@/models/Core.model.ts";
import { TransferStatBlockModel } from "@/models/transfers/Transfers.model.ts";
import GridModel from "@/models/transfers/grid/Grid.model.ts";
import store from "@/store.ts";
import type { IFilters } from "@shared/schema/filters.schema.js";
import { type Instance, getParentOfType, getSnapshot, isAlive, types } from "mobx-state-tree";

const GridItemModel = types.compose(
	"GridItemModel",
	CoreModel,
	types.model({
		i: types.string,
		x: types.number,
		w: types.number,
		h: types.number,

		// selectedX is one of keys in TransfersPrepare
		selectedX: types.enumeration(["country", "height", "weekday", "count"]),

		// selectedY is an array of keys of TransferStatBlockValues
		selectedY: types.array(types.enumeration(["count", "percent", "price_max", "price_avg", "price_min"])),
	}),
);

const actions = (self: Instance<typeof GridItemModel>) => {
	return {
		update(updates: Partial<IFilters>) {
			if (!isAlive(self)) return;

			for (const key in updates) {
				const typedKey = key as keyof IFilters;
				if (updates[typedKey] !== undefined && key in self) {
					(self as any)[key] = updates[typedKey];
				}
			}

			// Save all grid items to LS
			window.localStorage.setItem("transfers:grid", JSON.stringify(getSnapshot(getParentOfType(self, GridModel))));
		},
	};
};

const views = (self: Instance<typeof GridItemModel>) => {
	return {
		get chartData(): ILineChartData {
			const transferStatBlock = store.transfers.data[self.selectedX] as Instance<typeof TransferStatBlockModel>;
			return {
				series: self.selectedY.map(selectedDataType => {
					return {
						name: `Transfers ${selectedDataType} for ${self.selectedX}`,
						type: "line",
						smooth: false,
						// @ts-ignore
						data: transferStatBlock.values[selectedDataType] as any,
						symbol: "none",
						dataType: selectedDataType,
					};
				}),
				xAxisData: transferStatBlock.labels,
				minY: 0,
				maxY: Math.round(
					self.selectedY.reduce((res, selectedDataType) => {
						// @ts-ignore
						const max = Math.max(...transferStatBlock.values[selectedDataType]);
						return Math.max(res, max);
					}, 0),
				),
			};
		},

		get xLabelsTypes(): (keyof ITransfersPrepare)[] {
			// @ts-ignore
			const [count, ...xLabelsTypes] = Object.keys(store.transfers.data);
			return xLabelsTypes as (keyof ITransfersPrepare)[];
		},

		get yLabelsTypes(): (keyof ITransferStatBlockValues)[] {
			const transferStatBlock = store.transfers.data[self.selectedX] as Instance<typeof TransferStatBlockModel>;
			return Object.keys(transferStatBlock?.values || {}) as (keyof ITransferStatBlockValues)[];
		},

		formatY(value: number, seriesIndex: number) {
			const dataType = this.chartData.series[seriesIndex].dataType;
			switch (dataType) {
				case "price_avg":
				case "price_min":
				case "price_max":
					return Intl.NumberFormat("uk-UA", {
						style: "currency",
						currency: "UAH",
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					}).format(value * 6.4);
				case "percent":
					return `${value}%`;
				default:
					return value;
			}
		},
	};
};

const volatile = () => {
	return {
		minH: GRID_ITEM_MIN_HEIGHT,
		minW: GRID_ITEM_MIN_WIDTH,
	};
};

export default GridItemModel.actions(actions).views(views).volatile(volatile);
