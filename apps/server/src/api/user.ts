import { UserSchema } from "@shared/schema";
import { Elysia } from "elysia";

export default (app: Elysia, route: string) => {
	app.get(route, () => UserSchema.parse({ id: "1", name: "Alice" }));
};
