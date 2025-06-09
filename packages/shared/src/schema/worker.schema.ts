import { TSortBy, TSortOrder } from "./basic.schema.js";
import { IFilters } from "./filters.schema.js";
import { IResponse } from "./response.schema.js";
import { ITransfer } from "./transfers.schema.js";

export type TWorkerProgress = { total: number; loaded: number; progress: number };

export interface IWorkerAPIInitResponse {
	fromMs: number;
	toMs: number;
}
export interface IWorkerAPI {
	init: () => Promise<IResponse<IWorkerAPIInitResponse>>;
	filter: (filters: IFilters) => Promise<IResponse<ITransfersPrepare>>;
	transfers: ({ page, perPage, sortBy, sortOrder }: { page: number; perPage: number; sortBy: TSortBy; sortOrder: TSortOrder }) => Promise<
		IResponse<{
			transfers: ITransfer[];
			total: number;
		}>
	>;
}
