import { z } from "zod";

const TransferShortNamesSchema = z.object({
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
});

export default TransferShortNamesSchema;
export type ITransfersShortNames = z.infer<typeof TransferShortNamesSchema>;
