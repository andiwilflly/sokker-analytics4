import { ITransfer } from "@shared/schema/transfers.schema";
import countriesUtil from "@shared/utils/countries.util";

export default function transfersPrepareByCountry(transfers: ITransfer[]): ITransferStatBlock {
	const countryMap = new Map<
		number,
		{
			count: number;
			priceSum: number;
			priceMax: number;
			priceMin: number;
		}
	>();

	const transfersLength = transfers.length; // Cache length

	// Step 1: Aggregate all data by country in one loop
	for (let i = 0; i < transfersLength; i++) {
		const transfer = transfers[i];
		const country = transfer.country;
		const price = transfer.price;

		const existing = countryMap.get(country);
		if (existing) {
			existing.count++;
			existing.priceSum += price;
			existing.priceMax = price > existing.priceMax ? price : existing.priceMax;
			existing.priceMin = price < existing.priceMin ? price : existing.priceMin;
		} else {
			countryMap.set(country, {
				count: 1,
				priceSum: price,
				priceMax: price,
				priceMin: price,
			});
		}
	}

	// Step 2: Create country lookup cache to avoid repeated finds
	const countryCache = new Map<number, { icon: string; name: string }>();
	for (const code of countryMap.keys()) {
		const country = countriesUtil.find(({ code: c }) => c === code);
		if (country) {
			countryCache.set(code, { icon: country.icon, name: country.name });
		}
	}

	// Step 3: Convert to array and prepare results
	const countryEntries = Array.from(countryMap.entries());
	const size = countryEntries.length;

	// Pre-allocate arrays
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
		const [code, stats] = countryEntries[i];
		const { count, priceSum, priceMax, priceMin } = stats;

		const countryInfo = countryCache.get(code);
		labels[i] = countryInfo ? `${countryInfo.icon} ${countryInfo.name}` : `Unknown (${code})`;

		values.count[i] = count;
		values.percent[i] = Math.round(((count * 100) / transfersLength) * 100) / 100; // Faster than toFixed
		values.price_max[i] = priceMax;
		values.price_min[i] = priceMin;
		values.price_avg[i] = Math.round(priceSum / count);
	}

	return { labels, values };
}
