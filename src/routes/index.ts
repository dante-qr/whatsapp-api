import { Router } from "express";
import chatRoutes from "./chats";
import groupRoutes from "./groups";
import messageRoutes from "./messages";
import sessionRoutes from "./sessions";
import contactRoutes from "./contacts";
import { apiKeyValidator } from "@/middlewares/api-key-validator";

const router = Router();
router.use("/sessions", sessionRoutes);
router.use("/:sessionId/chats", apiKeyValidator, chatRoutes);
router.use("/:sessionId/contacts", apiKeyValidator, contactRoutes);
router.use("/:sessionId/groups", apiKeyValidator, groupRoutes);
router.use("/:sessionId/messages", apiKeyValidator, messageRoutes);

router.post("/webhook", (req, res) => {
	console.log("🚀 ~ MYHOOK 1 ~ req:", req.body);
	res.status(200).send("OK OLD URL");
});

router.post("/webhookxddddd", (req, res) => {
	console.log("🚀 ~ MYHOOK 2 ~ req:", req.body);
	res.status(200).send("OK NUEVA URL");
});

export default router;
