import path from "node:path";
import BetterSqlite3 from "better-sqlite3";
import logger from "../logger.js";
import { IFilters } from "../schema/filters.schema.js";
import { ITransferShortNames } from "../schema/transfers.schema.js";
import earliestTransferQuery from "./query/earliestTransfer.query.js";
import transfersQuery from "./query/transfersQuery.js";

class DB {
	db: BetterSqlite3.Database;

	constructor() {
		this.db = new BetterSqlite3(path.join(process.cwd(), "./src/DB/transfers.db"), { readonly: true });
		logger.info("DB | Start success");
	}

	query = () => {
		return {
			earliestTransfer: (): number => {
				return this.db.prepare(earliestTransferQuery()).get() as number;
			},

			// TODO: Indexes!!
			transfers: ({
				filters,
				fields,
				limit,
			}: { filters: IFilters; fields: Array<keyof ITransferShortNames>; limit?: number }): ITransferShortNames[] => {
				const { query, params } = transfersQuery({
					filters,
					fields: fields,
					limit,
				});
				return this.db.prepare(query).all(...params) as ITransferShortNames[];
			},
		};
	};
}
const db = new DB();
export default db;
