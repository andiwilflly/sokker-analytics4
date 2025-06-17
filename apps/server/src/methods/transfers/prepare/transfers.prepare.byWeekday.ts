import { ITransfer } from "../../../schema/transfers.schema";

const weekdays: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function transfersPrepareByWeekday(transfers: ITransfer[]): ITransferStatBlock {
	const weekdayMap = new Map<
		number,
		{
			count: number;
			priceSum: number;
			priceMax: number;
			priceMin: number;
		}
	>();

	const transfersLength = transfers.length;

	// Aggregate by weekday
	for (let i = 0; i < transfersLength; i++) {
		const transfer = transfers[i];
		const date = new Date(transfer.transfer_time_ms);
		const weekday = date.getDay();

		const price = transfer.price;
		const existing = weekdayMap.get(weekday);

		if (existing) {
			existing.count++;
			existing.priceSum += price;
			existing.priceMax = price > existing.priceMax ? price : existing.priceMax;
			existing.priceMin = price < existing.priceMin ? price : existing.priceMin;
		} else {
			weekdayMap.set(weekday, {
				count: 1,
				priceSum: price,
				priceMax: price,
				priceMin: price,
			});
		}
	}

	// Prepare sorted arrays for all weekdays in order 0..6
	const labels = [];
	const values: ITransferStatBlockValues = {
		count: [],
		percent: [],
		price_max: [],
		price_min: [],
		price_avg: [],
	};

	for (let weekdayIndex = 0; weekdayIndex < 7; weekdayIndex++) {
		const stats = weekdayMap.get(weekdayIndex);

		if (stats) {
			const { count, priceSum, priceMax, priceMin } = stats;
			labels.push(weekdays[weekdayIndex]);
			values.count.push(count);
			values.percent.push(Math.round(((count * 100) / transfersLength) * 100) / 100);
			values.price_max.push(priceMax);
			values.price_min.push(priceMin);
			values.price_avg.push(Math.round(priceSum / count));
		}
	}

	return { labels, values };
}
