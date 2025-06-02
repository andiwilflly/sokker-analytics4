import { z } from "zod";

// Schema for ITransferStatBlockValues
export const TransferStatBlockValuesSchema = z.object({
	count: z.number().array(),
	percent: z.number().array(),
	price_max: z.number().array(),
	price_avg: z.number().array(),
	price_min: z.number().array(),
});

// Schema for ITransferStatBlock
export const TransferStatBlockSchema = z.object({
	labels: z.union([z.string(), z.number()]).array(),
	values: TransferStatBlockValuesSchema,
});

// Schema for ITransfersPrepare
export const TransfersPrepareSchema = z.object({
	country: TransferStatBlockSchema,
	height: TransferStatBlockSchema,
	weekday: TransferStatBlockSchema,
	count: z.number(),
});

// Schema for ITransferGridItemModelArguments
export const TransferGridItemModelArgumentsSchema = z.object({
	i: z.string(),
	x: z.number(),
	w: z.number(),
	h: z.number(),
	selectedX: z.union([z.literal("country"), z.literal("height"), z.literal("weekday"), z.literal("count")]),
	selectedY: z.array(
		z.union([z.literal("count"), z.literal("percent"), z.literal("price_max"), z.literal("price_avg"), z.literal("price_min")]),
	),
});

// Infer TypeScript type from schema (optional)
export type ITransferStatBlock = z.infer<typeof TransferStatBlockSchema>;
export type ITransfersPrepare = z.infer<typeof TransfersPrepareSchema>;
