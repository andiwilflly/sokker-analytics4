import countries, { currencyMapping } from "@shared/utils/countries.util";

export type TLang = (typeof countries)[number]["countryCode"];
export type TCurrency = (typeof currencyMapping)[keyof typeof currencyMapping]["currency"];
export type TCountry = {
	code: number;
	name: string;
	icon: string;
	rate: number;
	countryCode: string;
};
