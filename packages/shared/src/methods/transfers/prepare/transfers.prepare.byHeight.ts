import { ITransfer } from "../../../schema/transfers.schema";

export default function transfersPrepareByHeight(transfers: ITransfer[]): ITransferStatBlock {
	const heightMap = new Map<
		number,
		{
			count: number;
			priceSum: number;
			priceMax: number;
			priceMin: number;
		}
	>();

	const transfersLength = transfers.length; // Cache length

	// Single pass through transfers
	for (let i = 0; i < transfersLength; i++) {
		const t = transfers[i];
		const h = t.height;
		const price = t.price;

		const existing = heightMap.get(h);
		if (existing) {
			existing.count++;
			existing.priceSum += price;
			existing.priceMax = price > existing.priceMax ? price : existing.priceMax;
			existing.priceMin = price < existing.priceMin ? price : existing.priceMin;
		} else {
			heightMap.set(h, {
				count: 1,
				priceSum: price,
				priceMax: price,
				priceMin: price,
			});
		}
	}

	// Convert to sorted array once
	const sortedEntries = Array.from(heightMap.entries()).sort((a, b) => a[0] - b[0]);

	// Pre-allocate arrays with known size
	const size = sortedEntries.length;
	const labels = new Array<string>(size);
	const values: ITransferStatBlockValues = {
		count: new Array<number>(size),
		percent: new Array<number>(size),
		price_max: new Array<number>(size),
		price_min: new Array<number>(size),
		price_avg: new Array<number>(size),
	};

	// Single pass to populate results
	for (let i = 0; i < size; i++) {
		const [height, stats] = sortedEntries[i];
		const { count, priceSum, priceMax, priceMin } = stats;

		labels[i] = `${height} cm`;
		values.count[i] = count;
		values.percent[i] = Math.round((count * 100) / transfersLength);
		values.price_min[i] = priceMin;
		values.price_max[i] = priceMax;
		values.price_avg[i] = Math.round(priceSum / count);
	}

	return { labels, values };
}
