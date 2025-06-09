import { z } from "zod";
import jsonArrayOfNumbers from "../schema/helpers/jsonArrayOfNumbers.schema.helper";

const FiltersSchema = z
	.object({
		minSS: z.coerce.number(),
		maxSS: z.coerce.number(),

		minPrice: z.coerce.number(),
		maxPrice: z.coerce.number(),

		fromMs: z.coerce.number(),
		toMs: z.coerce.number(),

		selectedAges: z.union([
			z.array(z.coerce.number()), // already an array of numbers
			jsonArrayOfNumbers, // or a JSON string that parses to array of numbers
		]),

		selectedCountries: z.union([z.array(z.coerce.number()), jsonArrayOfNumbers]),
	})
	.strict();

export default FiltersSchema;
export type IFilters = z.infer<typeof FiltersSchema>;
