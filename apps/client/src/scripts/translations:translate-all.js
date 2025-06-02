import { execa } from "execa";

const countriesLanguages = {
	1: "pl", // Polska
	10: "it", // Italia
	9: "ro", // România
	21: "br", // Brasil
	41: "tr", // Türkiye
	17: "es", // España
	8: "hu", // Magyarország
	// 28: "be", // België
	// 13: "cz", // Česká republika
	// 16: "fr", // France
	// 15: "de", // Deutschland
	// 84: "vn", // Việt Nam
	// 19: "ar", // Argentina
	// 49: "gr", // Hellas
	// 3: "en", // England
	// 14: "sk", // Slovensko
	// 36: "co", // Colombia
	// 12: "nl", // Nederland
	// 39: "rs", // Srbija
	// 35: "uy", // Uruguay
	// 44: "ve", // Venezuela
	// 20: "pt", // Portugal
	// 54: "bg", // Bulgaria
	// 25: "fi", // Suomi
	// 42: "cl", // Chile
	// 34: "hr", // Hrvatska
	// 4: "us", // USA
	// 47: "ba", // Bosna i Hercegovina
	// 97: "cu", // Cuba
	// 37: "pe", // Perú
	// 33: "ee", // Eesti
	// 24: "ch", // Schweiz
	// 30: "at", // Österreich
	// 65: "id", // Indonesia
	// 23: "lt", // Lietuva
	// 79: "az", // Azərbaycan
	// 29: "dk", // Danmark
	// 18: "mx", // México
	// 27: "no", // Norge
	64: "uk", // Ukraina
};

async function start() {
	// Object.keys(countriesLanguages)
	for (const countryCode of Object.keys(countriesLanguages)) {
		const lang = countriesLanguages[countryCode];
		console.log(`Running translation for ${countryCode} (${lang})`);

		try {
			const subprocess = await execa("pnpm", ["exec", "node", "src/scripts/translations:translate.js", lang], {
				stdio: "inherit", // stream output directly
			});
		} catch (err) {
			console.error(`Failed for ${lang}:`, err);
		}
	}
}

start();
