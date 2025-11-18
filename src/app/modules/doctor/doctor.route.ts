import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get("/", DoctorController.getAllFromDB);
router.post("/suggestion", DoctorController.suggestion);
router.get("/:id", DoctorController.getById);
router.patch("/:id", DoctorController.updateIntoDB);
export const DoctorRoutes = router;
