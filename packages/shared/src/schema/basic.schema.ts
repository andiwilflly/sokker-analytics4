import countries from "@shared/utils/countries.util";

export type TLang = (typeof countries)[number]["countryCode"];
