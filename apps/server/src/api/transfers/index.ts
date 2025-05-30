import FiltersSchema, { IFilters } from "@shared/schema/filters.schema";
import { IResponse } from "@shared/schema/response.schema";
import { ITransfersShortNames } from "@shared/schema/transfers.schema";
import db from "apps/server/src/DB/DB";
import { Elysia } from "elysia";

export default (app: Elysia, route: string) => {
	app.get(
		route,
		({
			query,
		}: { query: IFilters }): IResponse<{
			durationMs: number;
			filters: IFilters;
			transfers: ITransfersShortNames[];
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
