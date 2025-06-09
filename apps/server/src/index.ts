import path from "node:path";
import { fileURLToPath } from "node:url";
import { node } from "@elysiajs/node";
import logger from "./logger.js";
import { Elysia } from "elysia";
import { glob } from "glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES_DIR = path.resolve(__dirname, "api"); // 'dist/api'
const app = new Elysia({ adapter: node() });

// Find all compiled JS route files
const files = await glob(`${ROUTES_DIR}/**/*.js`); // Note: looking for .js files in dist

for (const file of files) {
	// Compute route path from file path
	let routePath = file
		.replace(ROUTES_DIR, "")
		.replace(/\.js$/, "")
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
