import { Elysia } from "elysia";

export default (app: Elysia, route: string) => {
	app.get(route, () => ({
		home: "HOME",
	}));
};
