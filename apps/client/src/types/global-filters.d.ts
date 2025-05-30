export {};

declare global {
	interface IFilters {
		minSS: number;
		maxSS: number;

		minPrice: number;
		maxPrice: number;

		fromMs: number;
		toMs: number;

		selectedAges: number[];
		selectedCountries: number[];
	}
}
