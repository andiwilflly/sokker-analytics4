import { IFilters } from "@shared/schema/filters.schema";
import type { ITransferShortNames } from "@shared/schema/transfers.schema.js";
import { Transfers } from "@shared/scripts/flatbuffer/transfer";

export default function filterTransfers(
	transfersList: Transfers.TransferList,
	transfersCount: number,
	filters: IFilters,
): ITransferShortNames[] {
	if (!transfersList) return [];

	const ageSet = new Set(filters.selectedAges);
	const countrySet = new Set(filters.selectedCountries);
	const isFilterByAge = filters.selectedAges.length > 0;
	const isFilterByCountry = filters.selectedCountries.length > 0;

	const filteredTransfers: ITransferShortNames[] = new Array(transfersCount);
	let insertIndex = 0;

	for (let i = 0; i < transfersCount; i++) {
		const t = transfersList.transfers(i);

		if (!t) continue;

		const tt = Number(t.tt()); // seconds
		const ss = t.ss();
		const p = t.p();
		const a = t.a();
		const c = t.c();

		if (filters.minSS > ss) continue;
		if (filters.maxSS < ss) continue;
		if (filters.minPrice > p) continue;
		if (filters.maxPrice < p) continue;
		if (filters.fromMs > tt) continue;
		if (filters.toMs < tt) continue;
		if (isFilterByAge && !ageSet.has(a)) continue;
		if (isFilterByCountry && !countrySet.has(c)) continue;

		// Build full object matching ITransferShortNames
		filteredTransfers[insertIndex++] = {
			id: t.id() || "[id]", // assuming this returns a string
			pid: t.pid(),
			n: t.n() || "[name]", // name
			c,
			a,
			h: t.h(),
			w: t.w(),
			s: t.s(),
			wk: t.wk(),
			p,
			f: t.f(),
			st: t.st(),
			pc: t.pc(),
			tc: t.tc(),
			ps: t.ps(),
			kp: t.kp(),
			df: t.df(),
			pm: t.pm(),
			sr: t.sr(),
			si: t.si?.() ?? undefined, // optional
			bi: t.bi?.() ?? undefined, // optional
			ss,
			ass: t.ass(),
			dss: t.dss(),
			mss: t.mss(),
			gss: t.gss(),
			tt,
		};
	}

	filteredTransfers.length = insertIndex;
	return filteredTransfers;
}
