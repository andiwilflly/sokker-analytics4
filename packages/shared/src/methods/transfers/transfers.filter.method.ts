import { type IFilters } from "@shared/schema/filters.schema";
import { type ITransfer } from "@shared/schema/transfers.schema";

export default function filterTransfers(transfers: ITransfer[], filters: IFilters): ITransfer[] {
	const ageSet = new Set(filters.selectedAges);
	const countrySet = new Set(filters.selectedCountries);
	const isFilterByAge = ageSet.size > 0;
	const isFilterByCountry = countrySet.size > 0;

	return transfers.filter(t => {
		if (filters.minSS > t.all_skills) return false;
		if (filters.maxSS < t.all_skills) return false;
		if (filters.minPrice > t.price) return false;
		if (filters.maxPrice < t.price) return false;
		if (filters.fromMs > t.transfer_time_ms) return false;
		if (filters.toMs < t.transfer_time_ms) return false;
		if (isFilterByAge && !ageSet.has(t.age)) return false;
		if (isFilterByCountry && !countrySet.has(t.country)) return false;

		return true;
	});
}
