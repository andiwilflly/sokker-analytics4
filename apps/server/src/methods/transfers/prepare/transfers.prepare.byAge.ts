import { ITransfer } from "../../../schema/transfers.schema";

export default function transfersPrepareByAge(transfers: ITransfer[]): ITransferStatBlock {
	const minAge = 16;
	const maxAge = 40;
	const ages = Array.from({ length: maxAge - minAge + 1 }, (_, i) => i + minAge);

	const ageMap = new Map<
		number,
		{
			count: number;
			priceSum: number;
			priceMax: number;
			priceMin: number;
		}
	>();

	const transfersLength = transfers.length;

	// Aggregate by exact age
	for (let i = 0; i < transfersLength; i++) {
		const transfer = transfers[i];
		const age = transfer.age;
		const price = transfer.price;

		if (age < minAge || age > maxAge) continue;

		const existing = ageMap.get(age);

		if (existing) {
			existing.count++;
			existing.priceSum += price;
			existing.priceMax = Math.max(existing.priceMax, price);
			existing.priceMin = Math.min(existing.priceMin, price);
		} else {
			ageMap.set(age, {
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

	for (let age of ages) {
		const stats = ageMap.get(age);

		if (stats) {
			const { count, priceSum, priceMax, priceMin } = stats;
			values.count.push(count);
			values.price_max.push(priceMax);
			values.price_min.push(priceMin);
			values.price_avg.push(Math.round(priceSum / count));
			values.percent.push(Math.round((count / transfersLength) * 10000) / 100);
		} else {
			// Fill missing ages with 0 values
			values.count.push(0);
			values.price_max.push(0);
			values.price_min.push(0);
			values.price_avg.push(0);
			values.percent.push(0);
		}
	}

	return {
		labels: ages.map(age => `${age} y.o.`),
		values,
	};
}
