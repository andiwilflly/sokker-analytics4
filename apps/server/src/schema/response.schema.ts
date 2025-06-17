export interface ISuccessResponse<T> {
	data: T;
	error?: undefined;
}
export interface IErrorResponse {
	data?: undefined;
	error: string;
}
export type IResponse<T> = ISuccessResponse<T> | IErrorResponse;
