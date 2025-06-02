import countries from "@shared/utils/countries.util.ts";

for (let country of countries) {
	console.log(country);
}
// pnpm  tsc -b --force && node dist/scripts/translations/translate-all.js
