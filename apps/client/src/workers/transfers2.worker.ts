// import transferSchema, { DBVersionSchema } from "@/DB/transfers.schema";
// import axios, { type AxiosProgressEvent, type AxiosRequestConfig, type AxiosResponse } from "axios";
// import pako from "pako";
// import { type RxCollection, type RxDatabase, addRxPlugin, createRxDatabase } from "rxdb";
// import { RxDBMigrationSchemaPlugin } from "rxdb/plugins/migration-schema";
// import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
// import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
//
// addRxPlugin(RxDBQueryBuilderPlugin);
// addRxPlugin(RxDBMigrationSchemaPlugin);
//
// type MyCollections = {
// 	transfers: RxCollection<ITransferShortNames>;
// 	DBVersion: RxCollection<{ id: string; value: number }>;
// };
//
// class TransfersDB {
// 	db: RxDatabase<MyCollections> | null = null;
// 	progress: number = 0; // from 0 to 100 %
//
// 	constructor() {
// 		this.db = null;
// 	}
//
// 	async init() {
// 		const interval = setInterval(() => {
// 			this.progress = this.progress >= 100 ? 100 : this.progress + 1;
// 			self.postMessage({ action: "db:init:progress", data: this.progress });
// 		}, 200);
//
// 		try {
// 			await this.createDatabase().catch(e => console.log(e));
//
// 			// TODO: Testing
// 			// await this.db!.DBVersion.find().remove();
//
// 			const remoteDBVersion = await this.fetchDBVersion();
//
// 			const transferDoc = await this.db!.DBVersion.findOne("DBVersion").exec();
// 			const currentDBVersion: number = transferDoc?.value || 0;
//
// 			console.log("✅ transfersDB | currentDBVersion", currentDBVersion);
// 			console.log("✅ transfersDB | remoteDBVersion", remoteDBVersion);
//
// 			// Only load new transfers if the version has changed
// 			if (currentDBVersion !== remoteDBVersion) {
// 				const transfers = await this.fetchTransfers();
//
// 				console.log(`✅ transfersDB | Start load ${transfers.length} transfers to indexed DB`);
//
// 				// Load transfers to rxdb using bulkInsert
// 				await this.bulkInsert(transfers).catch(console.error);
//
// 				// You can also insert new documents
// 				await this.db!.DBVersion.upsert({
// 					id: "DBVersion",
// 					value: remoteDBVersion,
// 				}).catch(console.error);
//
// 				console.log(`✅ transfersDB | Loaded ${transfers.length} transfers to indexed DB`);
// 			} else {
// 				// If versions are the same, keep the existing transfers
// 				console.log("✅ transfersDB | No need to load transfers, versions are the same");
// 			}
//
// 			clearInterval(interval);
// 			this.progress = 100;
// 			self.postMessage({ action: "db:init:progress", data: this.progress });
// 		} catch (e: any) {
// 			clearInterval(interval);
// 			self.postMessage({ action: "db:init:error", error: e.toString() });
// 		}
// 	}
//
// 	private async createDatabase() {
// 		try {
// 			this.db = await createRxDatabase({
// 				name: "transfers",
// 				storage: getRxStorageDexie(),
// 				multiInstance: true,
// 			});
//
// 			// await this.db!.remove();
//
// 			// Create the transfers collection
// 			await this.db
// 				.addCollections({
// 					transfers: {
// 						schema: transferSchema,
// 					},
// 					DBVersion: {
// 						schema: DBVersionSchema,
// 					},
// 				})
// 				.catch(console.error);
//
// 			console.log("RxDB database created with Dexie storage");
// 		} catch (e: any) {
// 			console.log("RxDB database create error | ", e.toString());
// 		}
// 		return this.db;
// 	}
//
// 	private async bulkInsert(transfers: ITransferShortNames[]): Promise<number> {
// 		const batchSize = 1000; // Process transfers in batches to avoid overwhelming the browser
// 		let processed = 0;
//
// 		for (let i = 0; i < transfers.length; i += batchSize) {
// 			const batch = transfers.slice(i, i + batchSize).map(transfer => {
// 				transfer.id = String(transfer.id); // Convert number to string
// 				return transfer;
// 			});
//
// 			await this.db!.transfers.bulkInsert(batch);
//
// 			processed += batch.length;
// 			console.log(`Processed ${processed}/${transfers.length} transfers`);
// 		}
//
// 		return processed;
// 	}
//
// 	private async fetchTransfers(): Promise<ITransferShortNames[]> {
// 		let transfers: ITransferShortNames[] = [];
//
// 		try {
// 			const url = "/transfers.json.gz";
//
// 			const axiosConfig: AxiosRequestConfig = {
// 				responseType: import.meta.env.MODE === "development" ? "json" : ("arraybuffer" as const),
// 				onDownloadProgress: (event: AxiosProgressEvent) => {
// 					if (event.lengthComputable && event.total) {
// 						this.progress = Math.floor((event.loaded / event.total) * 100);
// 						self.postMessage({ action: "db:init:progress", data: this.progress });
// 						console.log(`📥 Progress: ${this.progress}%`);
// 					}
// 				},
// 			};
//
// 			console.log("✅ Load transfers...");
//
// 			const response: AxiosResponse = await axios.get(url, axiosConfig);
//
// 			if (import.meta.env.MODE === "development") {
// 				transfers = response.data as ITransferShortNames[];
// 			} else {
// 				const buffer = new Uint8Array(response.data);
// 				const jsonStr = pako.ungzip(buffer, { to: "string" });
// 				transfers = JSON.parse(jsonStr);
// 			}
// 		} catch (e) {
// 			this.progress = -1; // Error case
// 			self.postMessage({ action: "db:init:progress", data: this.progress });
// 			console.error("❌ Failed to load transfers:", e);
// 		}
//
// 		console.log("✅ transfersDB | Loaded transfers:", transfers.length);
// 		// return transfers.slice(0, 100);
// 		return transfers;
// 	}
//
// 	private async fetchDBVersion(): Promise<number> {
// 		try {
// 			const response = await axios.get<{ version: number }>("/db:version.json");
// 			const { version } = response.data;
// 			return version;
// 		} catch (error) {
// 			console.error("❌ Failed to load transfers version from file:", error);
// 			return 0; // or handle error as needed
// 		}
// 	}
// }
//
// const transfersDB = new TransfersDB();
//
// self.onmessage = async event => {
// 	const { action, filters }: IWorkerRequest = event.data;
//
// 	try {
// 		switch (action) {
// 			case "db:init":
// 				await transfersDB.init();
// 				self.postMessage({ action: "db:init:success" });
// 				break;
// 			case "db:transfers:filter":
// 				console.time("db:transfers:filter");
// 				const selector: any = {
// 					// tt: {
// 					// 	$gte: filters!.fromMs! / 1000,
// 					// 	$lte: filters!.toMs! / 1000,
// 					// },
// 					// ss: {
// 					// 	$gte: filters!.minSS,
// 					// 	$lte: filters!.maxSS,
// 					// },
// 					p: {
// 						$or: [
// 							// { p: { $gte: 0, $lte: 9999999999 } },
// 							{ p: null },
// 							{ p: { $exists: false } },
// 						],
// 					},
// 					// p: {
// 					// 	$gte: filters!.minPrice,
// 					// 	$lte: filters!.maxPrice,
// 					// },
// 					...(filters!.selectedAges!.length &&
// 						!filters!.selectedAges!.includes(999) && {
// 							a: {
// 								$in: filters!.selectedAges,
// 							},
// 						}),
// 					...(filters!.selectedCountries!.length &&
// 						!filters!.selectedCountries!.includes(999) && {
// 							c: {
// 								$in: filters!.selectedCountries,
// 							},
// 						}),
// 				};
//
// 				console.log("db:transfers:filter | selector", selector);
//
// 				const results = await transfersDB
// 					.db!.transfers.find({
// 						selector,
// 						sort: [{ tt: "desc" }],
// 					})
// 					.exec();
//
// 				console.log(
// 					"db:transfers:filter | ",
// 					filters,
// 					results.map(doc => doc.toJSON()),
// 				);
// 				console.timeEnd("db:transfers:filter");
// 				break;
// 		}
// 	} catch (error: any) {
// 		self.postMessage({ action: "db:transfers:error", error: (error as Error).message || "Unexpected error" });
// 	}
// };
