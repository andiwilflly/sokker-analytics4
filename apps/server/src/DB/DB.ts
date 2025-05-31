import path from "node:path";
import { IFilters } from "@shared/schema/filters.schema";
import { ITransferShortNames } from "@shared/schema/transfers.schema";
import earliestTransferQuery from "apps/server/src/DB/query/earliestTransfer.query";
import transfersQuery from "apps/server/src/DB/query/transfersQuery";
import logger from "apps/server/src/logger";
import BetterSqlite3 from "better-sqlite3";

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
