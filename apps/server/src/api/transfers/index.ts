import FiltersSchema, { IFilters } from "../../schema/filters.schema.js";
import { IResponse } from "../../schema/response.schema.js";
import { ITransferShortNames } from "../../schema/transfers.schema.js";
import db from "../../DB/DB.js";
import { Elysia } from "elysia";

export default (app: Elysia, route: string) => {
	app.get(
		route,
		({
			query,
		}: { query: IFilters }): IResponse<{
			durationMs: number;
			filters: IFilters;
			transfers: ITransferShortNames[];
		}> => {
			try {
				const startMs = Date.now();
				const filters = FiltersSchema.parse(query);
				const transfers = db.query().transfers({
					filters,
					fields: [], // all
					limit: 2,
				});
				return {
					data: {
						durationMs: Date.now() - startMs,
						filters,
						transfers: transfers,
					},
				};
			} catch (e: any) {
				return {
					error: e.toString(),
				};
			}
		},
	);
};
