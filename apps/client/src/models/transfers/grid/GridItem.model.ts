import { GRID_ITEM_MIN_HEIGHT, GRID_ITEM_MIN_WIDTH } from "@/CONSTANTS.ts";
import CoreModel from "@/models/Core.model.ts";
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
			const transferStatBlock = store.transfers.data[self.selectedX] as ITransferStatBlock;
			return {
				series: self.selectedY.map(selectedDataType => ({
					name: `Transfers ${selectedDataType} for ${self.selectedX}`,
					type: "line",
					smooth: false,
					data: transferStatBlock.values[selectedDataType],
					symbol: "none",
					dataType: selectedDataType,
				})),
				xAxisData: transferStatBlock.labels,
				minY: 0,
				maxY: Math.round(
					self.selectedY.reduce((res, selectedDataType) => {
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
			const transferStatBlock = store.transfers.data[self.selectedX] as ITransferStatBlock;
			return Object.keys(transferStatBlock?.values || {}) as (keyof ITransferStatBlockValues)[];
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
