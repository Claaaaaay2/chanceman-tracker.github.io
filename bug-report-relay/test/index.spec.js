import { afterEach, describe, expect, it, vi } from "vitest";
import worker from "../src";

const WEBHOOK_URL = "https://discord.invalid/webhook";

afterEach(() => {
	vi.restoreAllMocks();
});

describe("bug report relay", () => {
	it("forwards bug reports and keeps raw player blob text intact", async () => {
		const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, {
			status: 204
		}));
		const request = new Request("https://worker.invalid", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Origin": "https://chanceman-tracker.github.io"
			},
			body: JSON.stringify({
				message: "Something broke",
				files: {
					player: "AccountName",
					playerBlob: "{\"schemaVersion\":1,\"player\":{\"name\":\"AccountName\"}}",
					rolled: [1, 2]
				}
			})
		});

		const response = await worker.fetch(request, {
			DISCORD_WEBHOOK_URL: WEBHOOK_URL
		});

		expect(response.status).toBe(200);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(fetchMock.mock.calls[0][0]).toBe(WEBHOOK_URL);

		const webhookRequest = fetchMock.mock.calls[0][1];
		expect(webhookRequest.method).toBe("POST");
		expect(webhookRequest.body).toBeInstanceOf(FormData);

		const form = webhookRequest.body;
		expect(JSON.parse(form.get("payload_json"))).toEqual({
			content: "🐞 **Bug report**\n\nSomething broke"
		});
		expect(await form.get("file_player").text()).toBe("\"AccountName\"");
		expect(await form.get("file_playerBlob").text()).toBe("{\n  \"schemaVersion\": 1,\n  \"player\": {\n    \"name\": \"AccountName\"\n  }\n}");
		expect(await form.get("file_rolled").text()).toBe("[\n  1,\n  2\n]");
	});

	it("rejects invalid JSON payloads", async () => {
		const response = await worker.fetch(new Request("https://worker.invalid", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Origin": "https://chanceman-tracker.github.io"
			},
			body: "{invalid"
		}), {
			DISCORD_WEBHOOK_URL: WEBHOOK_URL
		});

		expect(response.status).toBe(400);
		expect(await response.text()).toBe("Invalid JSON");
	});
});
