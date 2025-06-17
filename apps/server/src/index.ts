import path from "node:path";
import { fileURLToPath } from "node:url";
import { node } from "@elysiajs/node";
import { Elysia } from "elysia";
import { glob } from "glob";
import logger from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Elysia({ adapter: node() });

// Use .ts in dev, .js in prod
const isDev = process.env.NODE_ENV !== "production";
const ROUTES_DIR = path.resolve(__dirname, "api");
const ext = isDev ? "ts" : "js";
let files = await glob(`${ROUTES_DIR}/**/*.${ext}`);
files = files.filter(f => !f.endsWith(".d.ts"));

console.log("____files -_____", isDev, files, `${ROUTES_DIR}/**/*.${ext}`);

for (const file of files) {
	// Compute route path from file path
	let routePath = file
		.replace(ROUTES_DIR, "")
		.replace(new RegExp(`\\.${ext}$`), "")
		.replace(/\/index$/, "")
		.replace(/\[([^\]]+)]/g, ":$1");

	if (!routePath) routePath = "/";

	// Import the route module using dynamic import
	const routeModule = await import(file);

	logger.info(`SERVER | Found new route: ${routePath}`);

	// Assume default export is a function (app, baseRoute)
	if (routeModule.default) routeModule.default(app, routePath);
}

const port = process.env.PORT || 3000;
app.listen(port, () => logger.fatal(`SERVER | Running on ${port}`));
