import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ReviewController } from "./review.controller";

const router = Router();
router.post("/", auth(UserRole.PATIENT), ReviewController.intertToDb);
export const ReviewRoutes = router;
