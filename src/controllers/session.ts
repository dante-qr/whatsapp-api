import { prisma } from "@/config/database";
import WhatsappService from "@/whatsapp/service";
import type { RequestHandler } from "express";

export const list: RequestHandler = (req, res) => {
	res.status(200).json(WhatsappService.listSessions());
};

export const find: RequestHandler = (req, res) =>
	res.status(200).json({ message: "Session found" });

export const status: RequestHandler = async (req, res) => {
	const session = WhatsappService.getSession(req.params.sessionId);

	if (!session) {
		return res.status(404).json({ error: "Sesión no encontrada" });
	}

	const qr = await prisma.whatsAppQR.findFirst({
		where: { sessionId: req.params.sessionId, isValid: true },
		orderBy: { createdAt: "desc" },
	});

	res.status(200).json({
		status: WhatsappService.getSessionStatus(session),
		qr: qr ? qr.qrCode : null,
	});
};

export const add: RequestHandler = async (req, res) => {
	const { sessionId, readIncomingMessages, ...socketConfig } = req.body;

	if (WhatsappService.sessionExists(sessionId))
		return res.status(400).json({ error: "Session already exists" });
	WhatsappService.createSession({ sessionId, res, readIncomingMessages, socketConfig });
};

export const addSSE: RequestHandler = async (req, res) => {
	const { sessionId } = req.params;
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		Connection: "keep-alive",
	});

	if (WhatsappService.sessionExists(sessionId)) {
		res.write(`data: ${JSON.stringify({ error: "Session already exists" })}\n\n`);
		res.end();
		return;
	}
	WhatsappService.createSession({ sessionId, res, SSE: true });
};

export const del: RequestHandler = async (req, res) => {
	await WhatsappService.deleteSession(req.params.sessionId);
	res.status(200).json({ message: "Session deleted" });
};
