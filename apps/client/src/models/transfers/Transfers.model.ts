import CoreModel from "@/models/Core.model.ts";
import FiltersModel from "@/models/transfers/Filters.model.ts";
import GridModel from "@/models/transfers/grid/Grid.model.ts";
import TransfersWorker from "@/workers/transfers/transfers.worker.ts?worker";
import type { IWorkerAPI } from "@shared/schema/worker.schema.ts";
import * as Comlink from "comlink";
import { types } from "mobx-state-tree";

// A generic frozen block of stats (useful if structure is dynamic or nested)
const TransferStatBlockValues = types.frozen({});

const TransferStatBlock = types.model("TransferStatBlock", {
	labels: types.array(types.union(types.string, types.number)),
	values: TransferStatBlockValues,
});

const TransfersPrepare = types.model("TransfersPrepare", {
	country: TransferStatBlock,
	height: TransferStatBlock,
	weekday: TransferStatBlock,
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
		data: TransfersPrepare,
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
		worker: Comlink.wrap<IWorkerAPI>(new TransfersWorker()),
	};
};

export default TransfersModel.actions(actions).views(views).volatile(volatile);
