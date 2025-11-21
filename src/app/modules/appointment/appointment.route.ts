import { Router } from "express";
import { AppointemntController } from "./appointment.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = Router();
// router.get("/", auth(UserRole.ADMIN), );

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
router.patch(
  "/status/:id",
  auth(UserRole.DOCTOR, UserRole.ADMIN),
  AppointemntController.updateAppointmentStatus
);

export const AppointementRoutes = router;
