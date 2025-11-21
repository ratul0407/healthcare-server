import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { PrescriptionController } from "./prescription.controller";

const router = Router();

router.get(
  "/my-prescriptions",
  auth(UserRole.PATIENT),
  PrescriptionController.myPrescriptions
);
router.post(
  "/",
  auth(UserRole.DOCTOR),
  PrescriptionController.createPrescription
);
export const PrescriptionRoutes = router;
