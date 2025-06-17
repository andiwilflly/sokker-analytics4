import { ITransfer } from "../../schema/transfers.schema";

export default function transfersTimeRange(transfers: ITransfer[]): {
	fromMs: number;
	toMs: number;
} {
	let fromMs = Infinity;
	let toMs = -Infinity;

	for (const t of transfers) {
		const tt = t.transfer_time_ms;
		fromMs = Math.min(fromMs, tt);
		toMs = Math.max(toMs, tt);
	}

	return { fromMs, toMs };
}
