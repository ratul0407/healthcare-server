import { Router } from "express";
import { AppointemntController } from "./appointment.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = Router();
router.post(
  "/",
  auth(UserRole.PATIENT),
  AppointemntController.createAppointment
);

export const AppointementRoutes = router;
