import db from "../DB/DB.js";
import { Elysia } from "elysia";

export default (app: Elysia, route: string) => {
	db.query().earliestTransfer();
	app.get(route, () => ({
		test: db.query().earliestTransfer(),
	}));
};
