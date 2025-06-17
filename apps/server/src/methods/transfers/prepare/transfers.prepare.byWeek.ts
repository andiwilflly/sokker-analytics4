import { ITransfer } from "../../../schema/transfers.schema";

const weeks: number[] = Array.from({ length: 16 }, (_, i) => i + 1);

export default function transfersPrepareByWeek(transfers: ITransfer[]): ITransferStatBlock {
	const weeksMap = new Map<
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
		const week = transfer.week;
		const price = transfer.price;
		const existing = weeksMap.get(week);

		if (existing) {
			existing.count++;
			existing.priceSum += price;
			existing.priceMax = price > existing.priceMax ? price : existing.priceMax;
			existing.priceMin = price < existing.priceMin ? price : existing.priceMin;
		} else {
			weeksMap.set(week, {
				count: 1,
				priceSum: price,
				priceMax: price,
				priceMin: price,
			});
		}
	}

	const values: ITransferStatBlockValues = {
		count: [],
		percent: [],
		price_max: [],
		price_min: [],
		price_avg: [],
	};

	for (let week of weeks) {
		const stats = weeksMap.get(week);

		if (stats) {
			const { count, priceSum, priceMax, priceMin } = stats;
			values.count.push(count);
			values.price_max.push(priceMax);
			values.price_min.push(priceMin);
			values.price_avg.push(Math.round(priceSum / count));
			values.percent.push(Math.round(((count * 100) / transfersLength) * 100) / 100);
		}
	}

	return { labels: weeks.map(week => `week ${week}`), values };
}
