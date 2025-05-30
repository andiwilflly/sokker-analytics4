import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"), // Now @ points to /src
			scripts: path.resolve(__dirname, "./scripts"), // Now @ points to /src
		},
	},
});
