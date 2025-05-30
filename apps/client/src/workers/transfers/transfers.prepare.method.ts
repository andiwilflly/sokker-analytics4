import transfersPrepareByCountry from "@/workers/transfers/prepare/transfers.prepare.byCountry.ts";
import transfersPrepareByHeight from "@/workers/transfers/prepare/transfers.prepare.byHeight.ts";
import transfersPrepareByWeekday from "@/workers/transfers/prepare/transfers.prepare.byWeekday.ts";

export default function transfersPrepare(transfers: ITransfer[]): ITransfersPrepare {
	return {
		count: transfers.length,
		country: transfersPrepareByCountry(transfers),
		height: transfersPrepareByHeight(transfers),
		weekday: transfersPrepareByWeekday(transfers),
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
		        ss: {
		            labels: [0 - 7*18],
		            values: {
		                count: []
		            }
		        }
		    }

		 }

		*  */
