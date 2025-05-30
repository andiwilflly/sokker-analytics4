import fs from "fs";
import path from "path";
import { Readable } from "stream"; // Added missing import
import { createGzip } from "zlib";
import Database from "better-sqlite3";
import * as flatbuffers from "flatbuffers"; // Fixed import
import { pipeline } from "stream/promises";
import { Transfers } from "./transfer";

const outPath = path.resolve("public", "transfers.bin.gz");
const versionPath = path.resolve("public", "db:version.json");
const dbPath = path.resolve("src/DB", "transfers.db");
const db = new Database(dbPath);

// Remove old file if exists
if (fs.existsSync(outPath)) {
	fs.unlinkSync(outPath);
	console.log("✅️ Removed existing transfers.bin.gz...");
}

const versionRow = db.prepare("SELECT ts FROM version LIMIT 1").get();
const version = versionRow?.ts ?? Date.now();
fs.writeFileSync(versionPath, JSON.stringify({ version }, null, 2), "utf8");
console.log(`✅ Save SQLite database version '${version}' ...`);

console.log("✅ Load SQLite database file...");

const rows = db.prepare("SELECT * FROM transfers").all(); // we need `.all()` to create vector
const total = rows.length;
const builder = new flatbuffers.Builder(1024);

const transferOffsets = rows.map((row, i) => {
	const idOffset = builder.createString(row.id);
	const nameOffset = builder.createString(row.n);

	Transfers.Transfer.startTransfer(builder);
	Transfers.Transfer.addId(builder, idOffset);
	Transfers.Transfer.addPid(builder, row.pid);
	Transfers.Transfer.addN(builder, nameOffset);
	Transfers.Transfer.addC(builder, row.c);
	Transfers.Transfer.addA(builder, row.a);
	Transfers.Transfer.addH(builder, row.h);
	Transfers.Transfer.addW(builder, row.w);
	Transfers.Transfer.addS(builder, row.s);
	Transfers.Transfer.addWk(builder, row.wk);
	Transfers.Transfer.addP(builder, row.p);
	Transfers.Transfer.addF(builder, row.f);
	Transfers.Transfer.addSt(builder, row.st);
	Transfers.Transfer.addPc(builder, row.pc);
	Transfers.Transfer.addTc(builder, row.tc);
	Transfers.Transfer.addPs(builder, row.ps);
	Transfers.Transfer.addKp(builder, row.kp);
	Transfers.Transfer.addDf(builder, row.df);
	Transfers.Transfer.addPm(builder, row.pm);
	Transfers.Transfer.addSr(builder, row.sr);
	if (row.si !== undefined) Transfers.Transfer.addSi(builder, row.si);
	if (row.bi !== undefined) Transfers.Transfer.addBi(builder, row.bi);
	Transfers.Transfer.addSs(builder, row.ss);
	Transfers.Transfer.addAss(builder, row.ass);
	Transfers.Transfer.addDss(builder, row.dss);
	Transfers.Transfer.addMss(builder, row.mss);
	Transfers.Transfer.addGss(builder, row.gss);
	Transfers.Transfer.addTt(builder, BigInt(row.tt));

	const offset = Transfers.Transfer.endTransfer(builder);

	if (i % 10_000 === 0 || i === total - 1) {
		const percent = (((i + 1) / total) * 100).toFixed(2);
		process.stdout.write(`\r✅ Serialized ${i + 1}/${total} transfers (${percent}%)`);
	}

	return offset;
});

const vector = Transfers.TransferList.createTransfersVector(builder, transferOffsets);
Transfers.TransferList.startTransferList(builder);
Transfers.TransferList.addTransfers(builder, vector);
const listOffset = Transfers.TransferList.endTransferList(builder);

builder.finish(listOffset);
const buffer = builder.asUint8Array();

fs.mkdirSync(path.dirname(outPath), { recursive: true });
console.log(`\n✅ Flatbuffer create file ${outPath}.`);
await pipeline(Readable.from([buffer]), createGzip(), fs.createWriteStream(outPath));

console.log(`\n✅ Flatbuffer DB written, compressed and saved.`);
