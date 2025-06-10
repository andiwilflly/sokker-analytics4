import CoreModel from "@/models/Core.model";
import FiltersModel from "@/models/transfers/Filters.model";
import SearchModel from "@/models/transfers/Search.model.ts";
import GridModel from "@/models/transfers/grid/Grid.model";
import TransfersWorker from "@/workers/transfers/transfers.worker.ts?worker";
import type { IWorkerAPI } from "@shared/schema/worker.schema";
import type { Remote } from "comlink";
import { types } from "mobx-state-tree";

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
