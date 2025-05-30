import transferNamesMapping from "@/DB/transferNamesMapping";

export default function transfersNormalize(transfers: ITransferShortNames[]): ITransfer[] {
	const transferShortNames = Object.keys(transferNamesMapping) as (keyof ITransferShortNames)[];
	const mapLength = transferShortNames.length;
	const result = new Array<ITransfer>(transfers.length);

	for (let i = 0; i < transfers.length; i++) {
		const shortNamesTransfer = transfers[i];
		const transfer = {} as ITransfer;

		for (let j = 0; j < mapLength; j++) {
			const shortKey = transferShortNames[j];
			const longKey = transferNamesMapping[shortKey] as keyof ITransfer;

			const value = shortNamesTransfer[shortKey];
			if (value !== undefined) {
				(transfer as any)[longKey] = value;
			}
		}

		if (i === 0) console.log(transfer);

		result[i] = transfer;
	}

	return result;
}
