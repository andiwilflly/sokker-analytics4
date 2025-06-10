import { z } from "zod";

const SkillSchema = z.union([z.literal("ALL"), z.coerce.number().int().min(0).max(18)]);

const SearchSchema = z
	.object({
		name: z.coerce.string().optional().default("ALL"),
		age: z.coerce
			.number()
			.refine(val => val === 0 || (val >= 16 && val <= 40), {
				message: "Age must be 0 or between 16 and 40",
			})
			.optional()
			.default(0),
		stamina: z.coerce.string().optional().default("ALL"),
		keeper: SkillSchema.optional().default("ALL"),
		pace: SkillSchema.optional().default("ALL"),
		defender: SkillSchema.optional().default("ALL"),
		technique: SkillSchema.optional().default("ALL"),
		playmaker: SkillSchema.optional().default("ALL"),
		passing: SkillSchema.optional().default("ALL"),
		striker: SkillSchema.optional().default("ALL"),
	})
	.strict();

export default SearchSchema;
export type ISearch = z.infer<typeof SearchSchema>;
