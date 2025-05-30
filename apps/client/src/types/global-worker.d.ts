export {};

declare global {
	interface IWorkerRequest {
		action: string;
		filters?: IFilters;
	}

	export interface IWorkerSuccessResponse<T> {
		data: T;
		error?: undefined;
	}
	export interface IWorkerErrorResponse {
		data?: undefined;
		error: string;
	}
	export type IWorkerResponse<T> = IWorkerSuccessResponse<T> | IWorkerErrorResponse;

	// Worker API
	export interface IWorkerAPIInitResponse {
		fromMs: number;
		toMs: number;
	}
	export interface IWorkerAPI {
		init: () => Promise<IWorkerResponse<IWorkerAPIInitResponse>>;
		filter: (filters: IFilters) => Promise<IWorkerResponse<ITransfersPrepare>>;
	}
}
