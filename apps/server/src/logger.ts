interface LogContext {
	requestId?: string;
	userId?: string | number;
	method?: string;
	path?: string;
	statusCode?: number;
	duration?: number;
	[key: string]: unknown;
}

const COLORS: Record<number, string> = {
	10: "\x1b[90m", // gray
	20: "\x1b[36m", // cyan
	30: "\x1b[32m", // green
	40: "\x1b[33m", // yellow
	50: "\x1b[31m", // red
	60: "\x1b[35m", // magenta
};

const RESET = "\x1b[0m";
const GRAY = "\x1b[90m";

// Logger interface
interface YarnLogger {
	info(msg: string, data?: LogContext): void;
	warn(msg: string, data?: LogContext): void;
	error(msg: string, data?: LogContext): void;
	debug(msg: string, data?: LogContext): void;
	trace(msg: string, data?: LogContext): void;
	fatal(msg: string, data?: LogContext): void;
	child(context: LogContext): YarnLogger;
}

// Helper function to format context
const formatContext = (data: LogContext = {}): string => {
	if (Object.keys(data).length === 0) return "";

	return ` ${GRAY}•${RESET} ${Object.entries(data)
		.map(([k, v]) => `${GRAY}${k}:${RESET} ${JSON.stringify(v)}`)
		.join(` ${GRAY}•${RESET} `)}`;
};

// Helper function to format error context
const formatErrorContext = (data: LogContext = {}): string => {
	let context = "";
	const dataCopy = { ...data };

	if (dataCopy.err && dataCopy.err instanceof Error && dataCopy.err.stack) {
		context = `\n${GRAY}   ${dataCopy.err.stack}${RESET}`;
		delete dataCopy.err;
	}

	if (Object.keys(dataCopy).length > 0) {
		const extraContext = Object.entries(dataCopy)
			.map(([k, v]) => `${GRAY}${k}:${RESET} ${JSON.stringify(v)}`)
			.join(` ${GRAY}•${RESET} `);
		context = context ? `${context}\n${GRAY}   ${extraContext}${RESET}` : ` ${GRAY}•${RESET} ${extraContext}`;
	}

	return context;
};

// Create yarn-style logger
const createYarnLogger = (baseContext: LogContext = {}): YarnLogger => {
	const getTime = (): string => new Date().toTimeString().split(" ")[0];

	return {
		info: (msg: string, data: LogContext = {}) => {
			const context = formatContext({ ...baseContext, ...data });
			console.log(`${COLORS[30]}●${RESET} ${GRAY}[${getTime()}]${RESET} ${msg}${context}`);
		},

		warn: (msg: string, data: LogContext = {}) => {
			const context = formatContext({ ...baseContext, ...data });
			console.log(`${COLORS[40]}◐${RESET} ${GRAY}[${getTime()}]${RESET} ${msg}${context}`);
		},

		error: (msg: string, data: LogContext = {}) => {
			const context = formatErrorContext({ ...baseContext, ...data });
			console.log(`${COLORS[50]}●${RESET} ${GRAY}[${getTime()}]${RESET} ${msg}${context}`);
		},

		debug: (msg: string, data: LogContext = {}) => {
			if (process.env.NODE_ENV === "production") return;
			const context = formatContext({ ...baseContext, ...data });
			console.log(`${COLORS[20]}○${RESET} ${GRAY}[${getTime()}]${RESET} ${msg}${context}`);
		},

		trace: (msg: string, data: LogContext = {}) => {
			if (process.env.NODE_ENV === "production") return;
			const context = formatContext({ ...baseContext, ...data });
			console.log(`${COLORS[10]}○${RESET} ${GRAY}[${getTime()}]${RESET} ${msg}${context}`);
		},

		fatal: (msg: string, data: LogContext = {}) => {
			const context = formatErrorContext({ ...baseContext, ...data });
			console.log(`${COLORS[60]}●${RESET} ${GRAY}[${getTime()}]${RESET} ${msg}${context}`);
		},

		child: (context: LogContext): YarnLogger => {
			return createYarnLogger({ ...baseContext, ...context });
		},
	};
};

// Export both loggers
export const yarnLogger = createYarnLogger();

// // Usage examples with proper typing
// yarnLogger.info("Server started", {
// 	port: 3000,
// 	env: "development" as const,
// 	uptime: Date.now(),
// });
//
// yarnLogger.warn("Deprecated API usage");
//
// yarnLogger.error("Database connection failed", {
// 	err: "Connection timeout",
// 	retries: 3,
// 	database: "postgresql",
// });

// Default export
export default yarnLogger;
