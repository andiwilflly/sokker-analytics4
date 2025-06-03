import CoreModel from "@/models/Core.model.ts";
import FiltersModel from "@/models/transfers/Filters.model.ts";
import GridModel from "@/models/transfers/grid/Grid.model.ts";
import TransfersWorker from "@/workers/transfers/transfers.worker.ts?worker";
import type { IWorkerAPI } from "@shared/schema/worker.schema.ts";
import type { Remote } from "comlink";
import { types } from "mobx-state-tree";

// A generic frozen block of stats (useful if structure is dynamic or nested)
export const TransferStatBlockValuesModel = types.frozen({});

export const TransferStatBlockModel = types.model("TransferStatBlockModel", {
	labels: types.array(types.union(types.string, types.number)),
	values: TransferStatBlockValuesModel,
});

export const TransfersPrepareModel = types.model("TransfersPrepareModel", {
	country: TransferStatBlockModel,
	height: TransferStatBlockModel,
	weekday: TransferStatBlockModel,
	count: types.number,
});

const TransfersModel = types.compose(
	"TransfersModel",
	CoreModel,
	types.model({
		filters: FiltersModel,
		grid: GridModel,

		fromMs: types.optional(types.number, 0),
		toMs: types.optional(types.number, 0),
		data: TransfersPrepareModel,
	}),
);

const actions = () => {
	return {};
};

const views = () => {
	return {};
};

const volatile = () => {
	return {
		rawWorker: new TransfersWorker(),
		worker: null as unknown as Remote<IWorkerAPI>,
	};
};

export default TransfersModel.actions(actions).views(views).volatile(volatile);
