import type { TLang } from "@shared/schema/basic.schema";
import countries from "@shared/utils/countries.util";
import rosetta, { type Rosetta } from "rosetta";

type I18nWithLangs = Rosetta<TLang> & {
	_langs: Set<TLang>;
	langs: () => TLang[];
};

const i18n = rosetta() as I18nWithLangs;

i18n._langs = new Set<TLang>();
i18n.langs = () => Array.from(i18n._langs);

// Wrap i18n.set to automatically track langs
const originalSet = i18n.set.bind(i18n);
i18n.set = (lang: TLang, table) => {
	i18n._langs.add(lang);
	return originalSet(lang, table);
};

const loadLanguage = async (lang: string) => {
	try {
		const messages = await import(`@/translations/lang/${lang}.json`);
		i18n.set(lang, messages.default);
		console.log("✅ i18n | Load translation for lang:", lang);
	} catch (err) {
		// console.error(`Missing translation for language: ${lang}`, err);
	}
};

for (let country of countries) {
	loadLanguage(country.countryCode);
}

export const t = (key: string, params?: Record<string, any>, lang?: string) => i18n.t(key, params, lang);

export default i18n;
