import * as path from "path";
// @ts-ignore
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
	// load env variables based on mode and current working directory
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [react(), tsconfigPaths(), tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				scripts: path.resolve(__dirname, "./scripts"),
				"@shared": path.resolve(__dirname, "../../packages/shared/src"),
			},
		},
		server: {
			proxy: {
				"/api": {
					target: env.VITE_API_PROXY,
					changeOrigin: true,
					rewrite: path => path.replace(/^\/api/, ""),
				},
			},
		},
	};
});
