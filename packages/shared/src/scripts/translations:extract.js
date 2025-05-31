import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as glob from "glob";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to find all text nodes inside <T>...</T>
const findTextNodes = directory => {
	const textNodes = {};

	// Use glob to find all .ts and .tsx files in the directory recursively
	const files = glob.sync(`${directory}/**/*.{ts,tsx}`);

	files.forEach(file => {
		const content = fs.readFileSync(file, "utf-8");

		// Regular expression to match <T>text</T> and t("text")
		const regex = /<T>(.*?)<\/T>|_t\(["'](.*?)["']\)/g;
		let match;

		// Loop through all matches in the current file
		while ((match = regex.exec(content)) !== null) {
			const text = (match[1] || match[2] || "").trim();
			if (text) {
				textNodes[text] = text;
			}
		}
	});

	return textNodes;
};

// Main function
const main = () => {
	const directory = path.join(__dirname, "../src");
	const translationsPath = path.resolve(__dirname, "../src/translations/lang");
	const parsedTexts = findTextNodes(directory);

	// Find all JSON translation files (e.g., en.json, ua.json, etc.)
	const translationFiles = glob.sync(`${translationsPath}/*.json`);

	// Process each translation file
	translationFiles.forEach(filePath => {
		const lang = path.basename(filePath, ".json"); // Extract language code (e.g., 'en', 'ua')
		let translations = {};

		if (fs.existsSync(filePath)) {
			translations = JSON.parse(fs.readFileSync(filePath, "utf-8"));
		}

		// Find keys that exist in the translation file but are no longer in parsedTexts
		const unusedKeys = Object.keys(translations).filter(key => !parsedTexts[key]);

		if (unusedKeys.length > 0) {
			console.log(`Unused keys in ${lang}.json:`);
			unusedKeys.forEach(key => console.log(`- ${key}`));

			// Remove unused keys
			unusedKeys.forEach(key => delete translations[key]);
		}

		// If this is `en.json`, merge new extracted keys
		if (lang === "en") {
			translations = { ...translations, ...parsedTexts };
		}

		// Write updated translations back to the file
		fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
		console.log(`Updated ${lang}.json with new and cleaned-up translations.`);
	});

	console.log("Translation check and cleanup completed for all languages.");
};

main();
