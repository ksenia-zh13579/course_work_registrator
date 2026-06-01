import { Router } from "express";
import { authRouter } from "./authRoutes.js";
import { profileRouter } from "./profileRoutes.js";
import { incidentsRouter } from "./incidentsRoutes.js";
import { participantsRouter } from "./participantsRoutes.js";
import { involvementsRouter } from "./involvementsRoutes.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/incidents", incidentsRouter);
router.use("/participants", participantsRouter);
router.use("/involvements", involvementsRouter);