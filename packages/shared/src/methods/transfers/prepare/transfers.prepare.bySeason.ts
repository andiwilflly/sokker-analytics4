import { ITransfer } from "../../../schema/transfers.schema";

export default function transfersPrepareBySeason(transfers: ITransfer[]): ITransferStatBlock {
	const seasonMap = new Map<
		number,
		{
			count: number;
			priceSum: number;
			priceMax: number;
			priceMin: number;
		}
	>();

	const transfersLength = transfers.length;

	// Aggregate by season
	for (let i = 0; i < transfersLength; i++) {
		const transfer = transfers[i];
		const season = transfer.season;
		const price = transfer.price;
		const existing = seasonMap.get(season);

		if (existing) {
			existing.count++;
			existing.priceSum += price;
			existing.priceMax = price > existing.priceMax ? price : existing.priceMax;
			existing.priceMin = price < existing.priceMin ? price : existing.priceMin;
		} else {
			seasonMap.set(season, {
				count: 1,
				priceSum: price,
				priceMax: price,
				priceMin: price,
			});
		}
	}

	// Sort seasons numerically
	const seasons = Array.from(seasonMap.keys()).sort((a, b) => a - b);

	const values: ITransferStatBlockValues = {
		count: [],
		percent: [],
		price_max: [],
		price_min: [],
		price_avg: [],
	};

	for (let season of seasons) {
		const stats = seasonMap.get(season)!;
		const { count, priceSum, priceMax, priceMin } = stats;

		values.count.push(count);
		values.price_max.push(priceMax);
		values.price_min.push(priceMin);
		values.price_avg.push(Math.round(priceSum / count));
		values.percent.push(Math.round(((count * 100) / transfersLength) * 100) / 100);
	}

	return { labels: seasons.map(season => `season ${season}`), values };
}
