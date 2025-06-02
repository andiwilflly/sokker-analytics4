import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { translate } from "@vitalets/google-translate-api";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the language code from command-line arguments
const targetLanguage = process.argv[2];
if (!targetLanguage) {
	console.error("Please provide a target language code, e.g., 'node translate.js uk'");
	process.exit(1);
}

// File paths
const inputFilePath = path.resolve(__dirname, "../src/translations/lang/en.json");
const outputFilePath = path.resolve(__dirname, `../src/translations/lang/${targetLanguage}.json`);

// Read the JSON files
const enTranslations = JSON.parse(fs.readFileSync(inputFilePath, "utf-8"));
let targetTranslations = {};
if (fs.existsSync(outputFilePath)) {
	targetTranslations = JSON.parse(fs.readFileSync(outputFilePath, "utf-8"));
} else {
	console.log(`No existing file found for ${targetLanguage}. A new file will be created.`);
}

// Compare and find missing keys
const missingTranslations = Object.keys(enTranslations).reduce((acc, key) => {
	if (!targetTranslations[key]) {
		acc[key] = enTranslations[key];
	}
	return acc;
}, {});

if (Object.keys(missingTranslations).length === 0) {
	console.log("No missing translations found.");
	process.exit(0);
}

// Translate only the missing keys
async function translateMissingKeys(missingKeys, targetLanguage) {
	for (const [key, value] of Object.entries(missingKeys)) {
		try {
			const result = await translate(value, { to: targetLanguage });
			targetTranslations[key] = result.text;
			console.log(`translated from en to ${targetLanguage} | ${value} -> ${result.text}`);
			console.log(`Translated: "${value}" -> "${result.text}"`);
		} catch (error) {
			console.error(`Error translating key "${key}":`, error.message);
			targetTranslations[key] = value; // Fallback to the original value
		}
	}

	// Write the updated translations to the output file
	fs.writeFileSync(outputFilePath, JSON.stringify(targetTranslations, null, 4), "utf-8");
	console.log(`Updated translations saved to ${outputFilePath}`);
}

// Run the translation process
translateMissingKeys(missingTranslations, targetLanguage);
