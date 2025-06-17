import { z } from "zod";

// Reusable helper for ranged number arrays
const NumberArrayInRange = (min: number, max: number) =>
	z
		.array(z.coerce.number().int().min(min).max(max), {
			required_error: "This field is required",
			invalid_type_error: "Must be an array of numbers",
		})
		.default([]); // default to empty array if omitted

const SearchSchema = z.object({
	name: z.coerce.string().default(""),
	fromMs: z.coerce.number().default(0),
	toMs: z.coerce.number().default(0),
	age: NumberArrayInRange(16, 40),
	stamina: NumberArrayInRange(0, 11),
	keeper: NumberArrayInRange(0, 18),
	pace: NumberArrayInRange(0, 18),
	defender: NumberArrayInRange(0, 18),
	technique: NumberArrayInRange(0, 18),
	playmaker: NumberArrayInRange(0, 18),
	passing: NumberArrayInRange(0, 18),
	striker: NumberArrayInRange(0, 18),
});

export default SearchSchema;
export type ISearch = z.infer<typeof SearchSchema>;
