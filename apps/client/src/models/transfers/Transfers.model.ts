import CoreModel from "@/models/Core.model";
import FiltersModel from "@/models/transfers/Filters.model";
import SearchModel from "@/models/transfers/Search.model.ts";
import GridModel from "@/models/transfers/grid/Grid.model";
import TransfersWorker from "@/workers/transfers/transfers.worker.ts?worker";
import type { IWorkerAPI } from "@server/schema/worker.schema";
import type { Remote } from "comlink";
import { type Instance, isAlive, types } from "mobx-state-tree";

const TransfersModel = types.compose(
	"TransfersModel",
	CoreModel,
	types.model({
		filters: FiltersModel,
		search: SearchModel,
		grid: GridModel,

		fromMs: types.optional(types.number, 0),
		toMs: types.optional(types.number, 0),

		isAdvancedSearch: types.optional(types.boolean, false),
	}),
);

const actions = (self: Instance<typeof TransfersModel>) => {
	return {
		update(updates: Partial<Instance<typeof TransfersModel>>) {
			if (!isAlive(self)) return;

			for (const key in updates) {
				const typedKey = key as keyof Instance<typeof TransfersModel>;
				if (updates[typedKey] !== undefined && key in self) {
					(self as any)[key] = updates[typedKey];
				}
			}

			// Save LS
			window.localStorage.setItem("transfers:isAdvancedSearch", JSON.stringify(self.isAdvancedSearch));
		},

		// Hooks
		afterCreate() {
			try {
				self.update({
					isAdvancedSearch: JSON.parse(window.localStorage.getItem("transfers:isAdvancedSearch") || ""),
				});
			} catch (e) {
				console.warn(e);
			}
		},
	};
};

const views = () => {
	return {};
};

const volatile = () => {
	return {
		rawWorker: new TransfersWorker(),
		worker: null as unknown as Remote<IWorkerAPI>,
		data: {} as ITransfersPrepare,
	};
};

export default TransfersModel.actions(actions).views(views).volatile(volatile);
