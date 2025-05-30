import { node } from "@elysiajs/node";
import { UserSchema } from "@shared/schema";
import { Elysia } from "elysia";

const app = new Elysia({ adapter: node() })
	.get("/", () => "Hello Elysia")
	.get("/user", () => {
		return UserSchema.parse({ id: "1", name: "Alice" });
	})
	.listen(3000, ({ hostname, port }) => {
		console.log(`🦊 Elysia is running at ${hostname}:${port}`);
	});

console.log("🦊 Server running on http://localhost:3000");

// For serverless/edge deployment
export default app;
