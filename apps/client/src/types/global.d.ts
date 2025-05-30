export {};

declare global {
	type TValueOf<T> = T[keyof T];

	type TLang = "en" | "uk";
}
