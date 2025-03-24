import type { EventsType } from "@/types/websocket";
import type { SocketServer } from "../server/websocket-server";
import env from "@/config/env";
import axios from "axios";
import { prisma } from "@/config/database";

let socketServer: SocketServer | null = null;
export function initializeSocketEmitter(server: SocketServer) {
	socketServer = server;
}

/* interface WebhookConfig {
	url: string;
	events: EventsType[] | "*";
}

const sessionWebhooks: Record<string, WebhookConfig[]> = {}; */

/* export function setSessionWebhooks(sessionId: string, webhooks: WebhookConfig[]) {
	sessionWebhooks[sessionId] = webhooks;
}
 */
export function emitEvent(
	event: EventsType,
	sessionId: string,
	data?: unknown,
	status: "success" | "error" = "success",
	message?: string,
) {
	sendSessionWebhooks(event, sessionId, data, status, message);

	if (env.ENABLE_WEBHOOK) {
		sendWebhook(event, sessionId, data, status, message);
	}

	if (!socketServer) {
		console.error("Socket server not initialized. Call initializeSocketEmitter first.");
		return;
	}
	socketServer.emitEvent(event, sessionId, { status, message, data });
}

export async function sendWebhook(
	event: EventsType,
	sessionId: string,
	data?: unknown,
	status: "success" | "error" = "success",
	message?: string,
) {
	try {
		await axios.post(env.URL_WEBHOOK, {
			sessionId,
			event,
			data,
			status,
			message,
		});
	} catch (e) {
		console.error("Error sending webhook", e);
	}
}

async function sendSessionWebhooks(
	event: EventsType,
	sessionId: string,
	data?: unknown,
	status: "success" | "error" = "success",
	message?: string,
) {
	const webhooks = await prisma.webhook.findMany({ where: { sessionId } });

	const sessionWebhooks = webhooks.map((webhook) => ({
		url: webhook.url,
		events: webhook.events.split(",").map((event) => event.trim()) as (EventsType | "*")[],
	}));

	for (const webhook of sessionWebhooks) {
		if (webhook.events.includes("*") || webhook.events.includes(event)) {
			try {
				await axios.post(webhook.url, {
					sessionId,
					event,
					data,
					status,
					message,
				});
			} catch (e) {
				console.error(`Error sending webhook ${sessionId} to`, webhook.url, e);
			}
		} else {
			console.warn(`Event ${event} is not allowed to ${sessionId}. Valid ->`, webhook.events);
		}
	}

	if (sessionWebhooks.length === 0) {
		console.warn("No webhooks found for ", sessionId);
	}
}
