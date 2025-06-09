import { TSortBy, TSortOrder } from "../schema/basic.schema";
import { IFilters } from "../schema/filters.schema";
import { IResponse } from "../schema/response.schema";
import { ITransfer } from "../schema/transfers.schema";

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
