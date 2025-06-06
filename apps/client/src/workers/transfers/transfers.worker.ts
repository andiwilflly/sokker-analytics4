import filterTransfers from "@shared/methods/transfers/transfers.filter.method.ts";
import transfersNormalize from "@shared/methods/transfers/transfers.normalize.method.ts";
import transfersPrepare from "@shared/methods/transfers/transfers.prepare.method.ts"; // Import the generated FlatBuffer code
import transfersTimeRange from "@shared/methods/transfers/transfers.timerange.method.ts";
import { transfersToJSON } from "@shared/methods/transfers/transfers.toJSON.method.ts";
import type { IFilters } from "@shared/schema/filters.schema.ts";
import type { IResponse } from "@shared/schema/response.schema.ts";
import type { ITransfer } from "@shared/schema/transfers.schema";
import { type IWorkerAPIInitResponse, type TWorkerProgress } from "@shared/schema/worker.schema.ts";
import { Transfers } from "@shared/scripts/flatbuffer/transfer.ts";
import axios, { type AxiosProgressEvent, type AxiosRequestConfig, type AxiosResponse } from "axios";
import * as Comlink from "comlink";
import { ByteBuffer } from "flatbuffers";
import pako from "pako";

class TransfersDB {
	transfersCount: number = 0;
	transfersFromMs!: number;
	transfersToMs!: number;
	transfersDBVersion!: number;
	transfersList!: ITransfer[];

	async init(): Promise<IResponse<IWorkerAPIInitResponse>> {
		try {
			await this.fetchDBVersion();
			await this.fetchTransfers();

			const { fromMs, toMs } = transfersTimeRange(this.transfersList);
			this.transfersFromMs = fromMs;
			this.transfersToMs = toMs;

			return { data: { fromMs: this.transfersFromMs, toMs: this.transfersToMs } };
		} catch (e: any) {
			return { error: e.toString() };
		}
	}

	private async fetchDBVersion() {
		try {
			const response: AxiosResponse<{ version: number }> = await axios.get("/db:version.json", {});
			this.transfersDBVersion = response.data.version;
		} catch (e) {
			console.log("❌ Failed to load DB version: ", e);
		}
	}

	private async fetchTransfers(): Promise<void> {
		try {
			const url = `/transfers.bin.gz?v=${this.transfersDBVersion}`;

			const headRes = await axios.head(url);
			const compressRatio = import.meta.env.MODE === "development" ? 2.4721612205247574 : 1;
			const totalLength = parseInt(headRes.headers["content-length"] || "0", 10) * compressRatio;

			const axiosConfig: AxiosRequestConfig = {
				responseType: "arraybuffer",
				onDownloadProgress: (event: AxiosProgressEvent) => {
					const progress = Math.floor((event.loaded / totalLength) * 100);
					self.postMessage({
						type: "transfers:progress",
						payload: {
							total: totalLength,
							loaded: event.loaded,
							progress,
						} as TWorkerProgress,
					});
				},
			};

			const response: AxiosResponse = await axios.get(url, axiosConfig);
			console.timeEnd("✅ transfersDB | Fetch transfers success");

			console.time("✅ transfersDB | Decompress transfers");
			// Decompress the gzipped data
			const decompressedBuffer =
				import.meta.env.MODE === "development" ? new Uint8Array(response.data) : pako.ungzip(new Uint8Array(response.data));

			const transfersBuffer: ByteBuffer = new ByteBuffer(decompressedBuffer);
			const binaryTransfers = Transfers.TransferList.getRootAsTransferList(transfersBuffer);
			this.transfersList = transfersNormalize(transfersToJSON(binaryTransfers, binaryTransfers.transfersLength()));
			this.transfersCount = this.transfersList.length;

			console.log("✅ transfersDB | Fetch transfers:", this.transfersCount);
			console.timeEnd("✅ transfersDB | Decompress transfers");
		} catch (e) {
			console.log("❌ transfersDB | Failed to load transfers: ", e);
			throw e;
		}
	}
}

const transfersDB = new TransfersDB();

class TransfersAPI {
	private filteredTransfers: ITransfer[] = [];

	public async init(): Promise<IResponse<IWorkerAPIInitResponse>> {
		const { data, error } = await transfersDB.init();
		if (error) return { error };
		return { data: data! };
	}

	public async filter(filters: IFilters): Promise<IResponse<ITransfersPrepare>> {
		try {
			console.time("✅ transfersDB | filterTransfers");
			this.filteredTransfers = filterTransfers(transfersDB.transfersList, filters);
			console.timeEnd("✅ transfersDB | filterTransfers");

			console.time("✅ transfersDB | transfersPrepare");
			const transfersData = transfersPrepare(this.filteredTransfers);
			console.timeEnd("✅ transfersDB | transfersPrepare");

			return {
				data: transfersData,
			};
		} catch (e: any) {
			return {
				error: e.toString(),
			};
		}
	}

	public async transfers({
		page,
		perPage,
		sortBy,
		sortOrder,
	}: { page: number; perPage: number; sortBy: keyof ITransfer; sortOrder: "DESC" | "ASC" }): Promise<
		IResponse<{
			transfers: ITransfer[];
			total: number;
		}>
	> {
		const start = page * perPage;
		const end = start + perPage;
		const sortedTransfers: ITransfer[] = this.filteredTransfers.toSorted((a, b) => {
			const aa: string | number = a[sortBy];
			const bb: string | number = b[sortBy];
			if (typeof bb === "string" && typeof aa === "string") return sortOrder === "ASC" ? aa.localeCompare(bb) : bb.localeCompare(aa);
			if (typeof aa === "number" && typeof bb === "number") return sortOrder === "ASC" ? aa - bb : bb - aa;
			return 0; // fallback if types are mismatched
		});

		const paginatedTransfers = sortedTransfers.slice(start, end);

		return {
			data: {
				transfers: paginatedTransfers,
				total: this.filteredTransfers.length,
			},
		};
	}
}

Comlink.expose(new TransfersAPI());
