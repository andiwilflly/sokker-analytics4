import { Transfers } from "@shared/scripts/flatbuffer/transfer";

export default function transfersTimeRange(
	transfersList: Transfers.TransferList,
	transfersCount: number,
): { fromMs: number; toMs: number } {
	let fromMs: number = Infinity;
	let toMs: number = -Infinity;
	for (let i = 0; i < transfersCount; i++) {
		const t = transfersList.transfers(i);

		if (!t) continue;

		const tt = Number(t.tt());

		fromMs = Math.min(fromMs, tt);
		toMs = Math.max(toMs, tt);
	}

	return { fromMs, toMs };
}
