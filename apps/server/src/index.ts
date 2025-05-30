import path from "path";
import { node } from "@elysiajs/node";
import { Elysia } from "elysia";
import { glob } from "glob";
import logger from "./logger";

const ROUTES_DIR = path.resolve(__dirname, "api"); // 'dist/api'
const app = new Elysia({ adapter: node() });

// Find all compiled JS route files
// Change this line since you're using .ts files in glob
const files = glob.sync(`${ROUTES_DIR}/**/*.ts`);

for (const file of files) {
	// Compute route path from file path
	let routePath = file
		.replace(ROUTES_DIR, "")
		.replace(/\.ts$/, "")
		.replace(/\/index$/, "")
		.replace(/\[([^\]]+)]/g, ":$1");

	if (!routePath) routePath = "/";

	// Import the route module
	const routeModule = require(file);

	logger.info(`SERVER | Found new route: ${routePath}`);

	// Assume default export is a function (app, baseRoute)
	if (routeModule.default) routeModule.default(app, routePath);
}

const port = process.env.PORT || 3000;
app.listen(port, () => logger.fatal(`SERVER | Running on ${port}`));
