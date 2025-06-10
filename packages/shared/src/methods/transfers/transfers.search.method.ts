import { type ISearch } from "@shared/schema/advancedSearch.schema";
import { type ITransfer } from "@shared/schema/transfers.schema";
import Fuse from "fuse.js";

export default function searchTransfers(transfers: ITransfer[], search: ISearch): ITransfer[] {
	transfers = transfers.filter(transfer => {
		// Filter by age
		const [minAge, maxAge] = search.age;
		if (transfer.age < minAge || transfer.age > maxAge) return false;
		if (transfer.transfer_time_ms < search.fromMs) return false;
		if (transfer.transfer_time_ms > search.toMs) return false;

		// Filter by skills
		const skillFilters: (keyof ISearch)[] = ["stamina", "keeper", "pace", "defender", "technique", "playmaker", "passing", "striker"];

		for (const key of skillFilters) {
			const [min, max] = search[key] as number[];
			const value = transfer[key as keyof ITransfer] as number;

			if (value < min || value > max) return false;
		}

		return true;
	});

	// Utility: remove accents and normalize
	const normalizeText = (text: string) =>
		text
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "") // remove diacritics
			.replace(/ç/g, "c")
			.replace(/ñ/g, "n")
			.replace(/ß/g, "ss")
			.replace(/ø/g, "o")
			.replace(/đ/g, "d")
			.toLowerCase();

	transfers = search.name?.trim()
		? new Fuse(transfers, {
				keys: ["name"],
				threshold: 0.2,
				ignoreLocation: true,
				getFn: (obj, path) => {
					const raw = Fuse.config.getFn(obj, path); // default getter
					if (typeof raw === "string") {
						return normalizeText(raw);
					}
					return raw;
				},
			})
				.search(search.name)
				.map(result => result.item)
		: transfers;

	return transfers;
}
