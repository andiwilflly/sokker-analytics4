import { z } from "zod";

export const TransferSchema = z.object({
	id: z.string(),
	pid: z.number(),
	name: z.string(),
	country: z.number(),
	age: z.number(),
	height: z.number(),
	weight: z.number(),
	season: z.number(),
	week: z.number(),
	price: z.number(),
	form: z.number(),
	stamina: z.number(),
	pace: z.number(),
	technique: z.number(),
	passing: z.number(),
	keeper: z.number(),
	defender: z.number(),
	playmaker: z.number(),
	striker: z.number(),
	value: z.number(),
	wage: z.number(),
	all_skills: z.number(),
	att_SS: z.number(),
	def_SS: z.number(),
	mid_SS: z.number(),
	gk_SS: z.number(),
	transfer_time_ms: z.number(),
});

export const TransferShortNamesSchema = z
	.object({
		id: z.string(), // id
		pid: z.number(), // player id
		n: z.string(), // name
		c: z.number(), // country
		a: z.number(), // age
		h: z.number(), // height
		w: z.number(), // weight
		s: z.number(), // season
		wk: z.number(), // week
		p: z.number(), // price
		f: z.number(), // form
		st: z.number(), // stamina
		pc: z.number(), // pace
		tc: z.number(), // technique
		ps: z.number(), // passing
		kp: z.number(), // keeper
		df: z.number(), // defender
		pm: z.number(), // playmaker
		sr: z.number(), // striker
		si: z.number().optional(), // seller_id (optional if not always present)
		bi: z.number().optional(), // buyer_id (optional if not always present)
		ss: z.number(), // all_skills
		ass: z.number(), // att_SS
		dss: z.number(), // def_SS
		mss: z.number(), // mid_SS
		gss: z.number(), // gk_SS
		tt: z.number(), // transfer_time_ms
	})
	.strict();

export type ITransfer = z.infer<typeof TransferSchema>;
export type ITransferShortNames = z.infer<typeof TransferShortNamesSchema>;
