import db from "apps/server/src/DB/DB";
import { Elysia } from "elysia";

export default (app: Elysia, route: string) => {
	db.query().earliestTransfer();
	app.get(route, () => ({
		test42: db.query().earliestTransfer(),
	}));
};
