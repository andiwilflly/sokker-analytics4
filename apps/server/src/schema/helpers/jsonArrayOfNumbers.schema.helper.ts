import { z } from "zod";

const jsonArrayOfNumbers = z
	.string()
	.transform(val => {
		try {
			return JSON.parse(val);
		} catch {
			return [];
		}
	})
	.refine((arr): arr is number[] => Array.isArray(arr) && arr.every(el => typeof el === "number"), {
		message: "Invalid array of numbers",
	});

export default jsonArrayOfNumbers;
