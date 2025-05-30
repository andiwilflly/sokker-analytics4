import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { createGzip } from "zlib";
import Database from "better-sqlite3";
import { pipeline } from "stream/promises";

const outPath = path.resolve("public", "transfers.json.gz");
const versionPath = path.resolve("public", "db:version.json");
const dbPath = path.resolve("src/DB", "transfers.db");
const db = new Database(dbPath);

// Remove old file if exists
if (fs.existsSync(outPath)) {
	fs.unlinkSync(outPath);
	console.log("✅️ Removed existing transfers.json.gz...");
}

console.log("✅ Load SQLite database file...");

// Get version (ms timestamp)
const versionRow = db.prepare("SELECT ts FROM version LIMIT 1").get();
const version = versionRow?.ts ?? Date.now();
// Use fs.writeFileSync to create or replace the file
fs.writeFileSync(versionPath, JSON.stringify({ version }, null, 2), "utf8");
console.log(`✅ Save SQLite database version '${version}' ...`);

const rows = db.prepare("SELECT * FROM transfers").iterate();

console.log("✅ Stream rows from SQLite...");

const total = db.prepare("SELECT COUNT(*) AS count FROM transfers").get().count;
let count = 0;
const logEvery = 10_000; // log progress every 10,000 rows

const jsonStream = Readable.from(
	(function* () {
		yield "[";
		let first = true;

		for (const row of rows) {
			if (!first) yield ",";
			else first = false;

			yield JSON.stringify(row);

			count++;
			if (count % logEvery === 0 || count === total) {
				const percent = ((count / total) * 100).toFixed(2);
				process.stdout.write(`\r✅ Processed ${count}/${total} rows (${percent}%)`);
			}
		}
		yield "]";
	})(),
);

fs.mkdirSync(path.dirname(outPath), { recursive: true });

await pipeline(jsonStream, createGzip(), fs.createWriteStream(outPath));

console.log(`✅ DB streamed, compressed and saved`);
