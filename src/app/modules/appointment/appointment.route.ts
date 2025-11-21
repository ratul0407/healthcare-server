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
router.get(
  "/my-appointments",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointemntController.getMyAppointments
);

export const AppointementRoutes = router;
