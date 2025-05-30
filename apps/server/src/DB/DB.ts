import path from "node:path";
import earliestTransferQuery from "apps/server/src/DB/query/earliestTransfer.query";
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
			earliestTransfer: () => {
				return this.db.prepare(earliestTransferQuery()).get();
			},
		};
	};
}
const db = new DB();
export default db;
