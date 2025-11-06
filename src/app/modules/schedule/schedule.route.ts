import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.get("/", ScheduleController.schedulesForDoctor);
router.post("/", ScheduleController.insertToDB);
router.delete("/:id", ScheduleController.deleteScheduleFromDB);
export const ScheduleRoutes = router;
