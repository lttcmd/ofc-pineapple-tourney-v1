import { Router } from "express";
import { sendOtp, verifyOtp } from "./service.js";
import { mem } from "../store/mem.js";

export const authRoutes = Router();

authRoutes.post("/auth/send-otp", async (req, res) => {
  const { phone } = req.body || {};
  if (!phone) return res.status(400).json({ error: "phone required" });
  await sendOtp(phone);
  res.json({ ok: true });
});

authRoutes.post("/auth/verify", (req, res) => {
  const { phone, code } = req.body || {};
  const result = verifyOtp(phone, code);
  if (!result) return res.status(400).json({ error: "invalid code" });
  mem.users.set(phone, { userId: result.userId, phone });
  res.json(result); // { userId, token }
});
