/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const ALLOWED_ORIGINS = [
	"https://chanceman-tracker.github.io",
	"http://localhost:5173"
];

export default {
	async fetch(request, env) {
		const origin = request.headers.get("Origin");

		let corsHeaders = {};
		if (ALLOWED_ORIGINS.includes(origin)) {
			corsHeaders = {
				"Access-Control-Allow-Origin": origin,
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			};
		} else {
			corsHeaders = {
				"Access-Control-Allow-Origin": "null",
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			};
		}

		// Handle preflight
		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: corsHeaders,
			});
		}

		if (request.method !== "POST") {
			return new Response("Method not allowed", {
				status: 405,
				headers: corsHeaders,
			});
		}

		let data;
		try {
			data = await request.json();
		} catch {
			return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
		}

		const webhookUrl = env.DISCORD_WEBHOOK_URL;

		const form = new FormData();
		form.append("payload_json", JSON.stringify({
			content: `🐞 **Bug report**\n\n${data.message}`
		}));

		for (const [name, content] of Object.entries(data.files)) {
			if (content == null) continue;

			form.append(
				`file_${name}`,
				new Blob([serializeReportFileContent(content)], { type: "application/json" }),
				`${name}.json`
			);
		}

		const res = await fetch(webhookUrl, {
			method: "POST",
			body: form
		});

		return new Response(JSON.stringify({ ok: res.ok }), {
			status: res.ok ? 200 : 500,
			headers: {
				...corsHeaders,
				"Content-Type": "application/json",
			},
		});
	}
};

function serializeReportFileContent(content) {
	if (typeof content === "string") {
		try {
			return JSON.stringify(JSON.parse(content), null, 2);
		} catch (error) {
			return JSON.stringify(content, null, 2);
		}
	}

	return JSON.stringify(content, null, 2);
}
