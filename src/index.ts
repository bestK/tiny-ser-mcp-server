import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Hono } from "hono";
import { layout, homeContent } from "./utils";
import { publish } from "./tiny-ser";

type Bindings = Env;

const app = new Hono<{
	Bindings: Bindings;
}>();

type Props = {
	bearerToken: string;
};

type State = null;

export class MyMCP extends McpAgent<Bindings, State, Props> {
	server = new McpServer({
		name: "Demo",
		version: "1.0.0",
	});

	async init() {
		this.server.tool("publish-to-tiny-server", {
			content: z.string({ description: "The content to publish" }),
			suffix: z.string({ description: "The suffix of the content only allow .md .html .gist or empty	" })
		}, async ({ content, suffix }) => {
			const allowedSuffixes = [".md", ".html", ".gist"];
			if (suffix && !allowedSuffixes.includes(suffix)) {
				return {
					content: [{ type: "text", text: "Invalid suffix, only allow .md .html .gist or empty" }],
				};
			}
			console.log("publish-to-tiny-server content", content);
			console.log("publish-to-tiny-server suffix", suffix);
			const result = await publish(content, suffix);
			console.log("publish-to-tiny-server result", result);
			return {
				content: [{ type: "text", text: String(result) }],
			};
		});

	}
}

// Render a basic homepage placeholder to make sure the app is up
app.get("/", async (c) => {
	const content = await homeContent(c.req.raw);
	return c.html(layout(content, "MCP Tiny Server"));
});

app.mount("/", (req, env, ctx) => {


	ctx.props = {
	};

	return MyMCP.mount("/sse").fetch(req, env, ctx);
});

export default app;
