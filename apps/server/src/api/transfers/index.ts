import FiltersSchema, { IFilters } from "@shared/schema/filters.schema";
import { IResponse } from "@shared/schema/response.schema";
import db from "apps/server/src/DB/DB";
import { Elysia } from "elysia";

export default (app: Elysia, route: string) => {
	db.query().earliestTransfer();
	app.get(route, ({ query }: { query: IFilters }): IResponse<any> => {
		try {
			const filters = FiltersSchema.parse(query);
			return {
				data: { filters, query },
			};
		} catch (e: any) {
			return {
				error: e.toString(),
			};
		}
	});
};
