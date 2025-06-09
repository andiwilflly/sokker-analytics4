import type { ITransferShortNames } from "../../schema/transfers.schema.js";
import { Transfers } from "../../scripts/flatbuffer/transfer.js";

export function transfersToJSON(transfersList: Transfers.TransferList, transfersCount: number): ITransferShortNames[] {
	if (!transfersList) return [];

	const normalizedTransfers: ITransferShortNames[] = new Array(transfersCount);

	for (let i = 0; i < transfersCount; i++) {
		const t = transfersList.transfers(i);
		if (!t) continue;

		normalizedTransfers[i] = {
			id: t.id() || "[id]",
			pid: t.pid(),
			n: t.n() || "[name]",
			c: t.c(),
			a: t.a(),
			h: t.h(),
			w: t.w(),
			s: t.s(),
			wk: t.wk(),
			p: t.p(),
			f: t.f(),
			st: t.st(),
			pc: t.pc(),
			tc: t.tc(),
			ps: t.ps(),
			kp: t.kp(),
			df: t.df(),
			pm: t.pm(),
			sr: t.sr(),
			si: t.si?.() ?? undefined,
			bi: t.bi?.() ?? undefined,
			ss: t.ss(),
			ass: t.ass(),
			dss: t.dss(),
			mss: t.mss(),
			gss: t.gss(),
			tt: Number(t.tt()),
		};
	}

	return normalizedTransfers;
}
