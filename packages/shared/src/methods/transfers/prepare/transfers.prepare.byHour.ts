import { ITransfer } from "../../../schema/transfers.schema";

const hours: number[] = Array.from({ length: 24 }, (_, i) => (i + 6) % 24); // 6 to 23, then 0 to 5

export default function transfersPrepareByHour(transfers: ITransfer[]): ITransferStatBlock {
	const hourMap = new Map<
		number,
		{
			count: number;
			priceSum: number;
			priceMax: number;
			priceMin: number;
		}
	>();

	const transfersLength = transfers.length;

	// Aggregate by hour of day
	for (let i = 0; i < transfersLength; i++) {
		const transfer = transfers[i];
		const hour = new Date(transfer.transfer_time_ms).getHours(); // local hour (0–23)
		const price = transfer.price;
		const existing = hourMap.get(hour);

		if (existing) {
			existing.count++;
			existing.priceSum += price;
			existing.priceMax = Math.max(existing.priceMax, price);
			existing.priceMin = Math.min(existing.priceMin, price);
		} else {
			hourMap.set(hour, {
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

	for (let hour of hours) {
		const stats = hourMap.get(hour);

		if (stats) {
			const { count, priceSum, priceMax, priceMin } = stats;
			values.count.push(count);
			values.price_max.push(priceMax);
			values.price_min.push(priceMin);
			values.price_avg.push(Math.round(priceSum / count));
			values.percent.push(Math.round((count / transfersLength) * 10000) / 100);
		} else {
			// Fill empty slots with zeros for consistent charting
			values.count.push(0);
			values.price_max.push(0);
			values.price_min.push(0);
			values.price_avg.push(0);
			values.percent.push(0);
		}
	}

	return {
		labels: hours.map(h => `${h}:00`),
		values,
	};
}
