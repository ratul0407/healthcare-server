import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.post("/", ScheduleController.insertToDB);
export const ScheduleRoutes = router;
