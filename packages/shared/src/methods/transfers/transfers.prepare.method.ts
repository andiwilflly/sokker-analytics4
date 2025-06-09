import transfersPrepareByAge from "../../methods/transfers/prepare/transfers.prepare.byAge";
import transfersPrepareByCountry from "../../methods/transfers/prepare/transfers.prepare.byCountry";
import transfersPrepareByHeight from "../../methods/transfers/prepare/transfers.prepare.byHeight";
import transfersPrepareByHour from "../../methods/transfers/prepare/transfers.prepare.byHour";
import transfersPrepareByWeek from "../../methods/transfers/prepare/transfers.prepare.byWeek";
import transfersPrepareByWeekday from "../../methods/transfers/prepare/transfers.prepare.byWeekday";
import { ITransfer } from "../../schema/transfers.schema";

export default function transfersPrepare(transfers: ITransfer[]): ITransfersPrepare {
	return {
		count: transfers.length,
		country: transfersPrepareByCountry(transfers),
		height: transfersPrepareByHeight(transfers),
		weekday: transfersPrepareByWeekday(transfers),
		week: transfersPrepareByWeek(transfers),
		hour: transfersPrepareByHour(transfers),
		age: transfersPrepareByAge(transfers),
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
