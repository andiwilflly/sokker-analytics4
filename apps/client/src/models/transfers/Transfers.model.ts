import CoreModel from "@/models/Core.model.ts";
import FiltersModel from "@/models/transfers/Filters.model.ts";
import GridModel from "@/models/transfers/grid/Grid.model.ts";
import TransfersWorker from "@/workers/transfers/transfers.worker.ts?worker";
import type { IWorkerAPI } from "@shared/schema/worker.schema.ts";
import type { Remote } from "comlink";
import { types } from "mobx-state-tree";

const TransfersModel = types.compose(
	"TransfersModel",
	CoreModel,
	types.model({
		filters: FiltersModel,
		grid: GridModel,

		fromMs: types.optional(types.number, 0),
		toMs: types.optional(types.number, 0),
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
		data: {} as ITransfersPrepare,
	};
};

export default TransfersModel.actions(actions).views(views).volatile(volatile);
