import { IFilters } from "@shared/schema/filters.schema";
import { ITransfersShortNames } from "@shared/schema/transfers.schema";

export default function transfersQuery({
	filters,
	fields,
	limit,
}: { filters: IFilters; fields: Array<keyof ITransfersShortNames>; limit?: number }) {
	const { minPrice, maxPrice, minSS, maxSS, fromMs, toMs, selectedAges, selectedCountries } = filters;

	const selectedFields = Array.isArray(fields) && fields.length > 0 ? fields.map(field => `t.${field}`).join(", ") : "t.*";

	const agesPlaceholders = selectedAges.length > 0 ? `AND t.a IN (${selectedAges.map(() => "?").join(", ")})` : "";
	const countriesPlaceholders = selectedCountries.length > 0 ? `AND t.c IN (${selectedCountries.map(() => "?").join(", ")})` : "";

	const query = `
	    SELECT ${selectedFields}
	    FROM transfers t
	    WHERE t.p > ?
	      AND t.p < ?
	      AND t.ss > ?
	      AND t.ss < ?
	      AND t.tt BETWEEN ? AND ?
	      ${agesPlaceholders}
	      ${countriesPlaceholders}
	    ORDER BY t.tt DESC
	    LIMIT ?
  	`;

	// Compose params in the correct order matching placeholders
	const params = [minPrice, maxPrice, minSS, maxSS, fromMs, toMs, ...selectedAges, ...selectedCountries, limit || 1000000];

	return { query, params };
}
