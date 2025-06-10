import { ITransfer } from "../../schema/transfers.schema.js";
import transfersPrepareByAge from "./prepare/transfers.prepare.byAge.js";
import transfersPrepareByCountry from "./prepare/transfers.prepare.byCountry.js";
import transfersPrepareByHeight from "./prepare/transfers.prepare.byHeight.js";
import transfersPrepareByHour from "./prepare/transfers.prepare.byHour.js";
import transfersPrepareBySeason from "./prepare/transfers.prepare.bySeason";
import transfersPrepareByWeek from "./prepare/transfers.prepare.byWeek.js";
import transfersPrepareByWeekday from "./prepare/transfers.prepare.byWeekday.js";

export default function transfersPrepare(transfers: ITransfer[]): ITransfersPrepare {
	return {
		count: transfers.length,
		country: transfersPrepareByCountry(transfers),
		height: transfersPrepareByHeight(transfers),
		weekday: transfersPrepareByWeekday(transfers),
		week: transfersPrepareByWeek(transfers),
		hour: transfersPrepareByHour(transfers),
		age: transfersPrepareByAge(transfers),
		season: transfersPrepareBySeason(transfers),
	};
}

/*
		 {
		    country: {
		        labels: ['🇵🇱 Polska', '🇷🇴 România'],
		        values: {
		            count: [polska number of pl, romaina num of players],
		            percent: [polska % of total pl, rom % of total],
		            price: {
		                max: [polska max price, r max price],
		                min: [],
		                avg: [polska avg price, r avg price]
		            }
		        }
		    },
		    height: {
		        labels: [161,162,163cm],
		        values: {
		            count: [161cm number of players],
		            percent: [161cm % or total players],
		            price: {
		                avg: [161cm abg price]
		                ...
		            }
		        }
		    },
		    {
				weekday ...
		    },
		    {
		        week : 0 - 12
		    }
		    {
		        ss: {
		            labels: [0 - 7*18],
		            values: {
		                count: []
		            }
		        }
		    }

		 }

		*  */
