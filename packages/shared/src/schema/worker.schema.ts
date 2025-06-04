import { IFilters } from "@shared/schema/filters.schema";
import { IResponse } from "@shared/schema/response.schema";

export type TWorkerProgress = { total: number; loaded: number; progress: number };

export interface IWorkerAPIInitResponse {
	fromMs: number;
	toMs: number;
}
export interface IWorkerAPI {
	init: () => Promise<IResponse<IWorkerAPIInitResponse>>;
	filter: (filters: IFilters) => Promise<IResponse<ITransfersPrepare>>;
}
