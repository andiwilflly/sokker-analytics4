import filterTransfers from "@/workers/transfers/transfers.filter.method.ts";
import transfersNormalize from "@/workers/transfers/transfers.normalize.method.ts";
import transfersPrepare from "@/workers/transfers/transfers.prepare.method.ts"; // Import the generated FlatBuffer code
import transfersTimeRange from "@/workers/transfers/transfers.timerange.method.ts";
import axios, { type AxiosProgressEvent, type AxiosRequestConfig, type AxiosResponse } from "axios";
import * as Comlink from "comlink";
import { ByteBuffer } from "flatbuffers";
import pako from "pako";
import { Transfers } from "scripts/flatbuffer/transfer.ts";

class TransfersDB {
	transfersCount: number = 0;
	transfersFromMs!: number;
	transfersToMs!: number;
	transfersDBVersion!: number;
	transfersList!: Transfers.TransferList;

	async init(): Promise<IWorkerResponse<IWorkerAPIInitResponse>> {
		try {
			await this.fetchDBVersion();
			await this.fetchTransfers();

			console.time("✅ transfersDB | Get transfers time Range");
			const { fromMs, toMs } = transfersTimeRange(this.transfersList, this.transfersCount); // Precompute fromMs, toMs once
			this.transfersFromMs = fromMs;
			this.transfersToMs = toMs;
			console.timeEnd("✅ transfersDB | Get transfers time Range");

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

			console.time("✅ transfersDB | Fetch transfers success");
			const axiosConfig: AxiosRequestConfig = {
				// Always use arraybuffer for binary data
				responseType: "arraybuffer",
				onDownloadProgress: (event: AxiosProgressEvent) => {
					if (event.lengthComputable && event.total) {
						const progress = Math.floor((event.loaded / event.total) * 100);
						console.log(`📥 Progress: ${progress}%`);
					}
				},
			};

			const response: AxiosResponse = await axios.get(url, axiosConfig);
			console.timeEnd("✅ transfersDB | Fetch transfers success");

			console.time("✅ transfersDB | Decompress transfers");
			// Decompress the gzipped data
			const decompressedBuffer =
				import.meta.env.MODE === "development" ? new Uint8Array(response.data) : pako.ungzip(new Uint8Array(response.data));

			const transfersBuffer: ByteBuffer = new ByteBuffer(decompressedBuffer);
			this.transfersList = Transfers.TransferList.getRootAsTransferList(transfersBuffer);
			this.transfersCount = this.transfersList.transfersLength();

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
	public async init(): Promise<IWorkerResponse<IWorkerAPIInitResponse>> {
		const { data, error } = await transfersDB.init();
		if (error) return { error };
		return { data: data! };
	}

	public async filter(filters: IFilters): Promise<IWorkerResponse<ITransfersPrepare>> {
		try {
			console.time("✅ transfersDB | filterTransfers");
			const filteredTransfers = filterTransfers(transfersDB.transfersList, transfersDB.transfersCount, filters);
			console.timeEnd("✅ transfersDB | filterTransfers");

			// TODO: We can normalize transfers once
			console.time("✅ transfersDB | transfersNormalize");
			const normalizedTransfers = transfersNormalize(filteredTransfers);
			console.timeEnd("✅ transfersDB | transfersNormalize");

			console.time("✅ transfersDB | transfersPrepare");
			const transfersData = transfersPrepare(normalizedTransfers);
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
}

Comlink.expose(new TransfersAPI());
