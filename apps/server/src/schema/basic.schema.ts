import { type ITransfer } from "./transfers.schema.js";
import countries, { currencyMapping } from "../utils/countries.util.js";

export type TSortBy = keyof ITransfer;
export type TSortOrder = "ASC" | "DESC";
export type TLang = (typeof countries)[number]["countryCode"];
export type TCurrency = (typeof currencyMapping)[keyof typeof currencyMapping]["currency"];
export type TCountry = {
	code: number;
	name: string;
	icon: string;
	rate: number;
	countryCode: string;
};
