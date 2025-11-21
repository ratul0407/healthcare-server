import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PrescriptionService } from "./prescription.service";
import { IJwtPayload } from "../../types/common";

const createPrescription = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;
    const result = await PrescriptionService.createPrescription;
    user as IJwtPayload, req.body();
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Prescription created successfully!",
      data: result,
    });
  }
);

export const PrescriptionController = {
  createPrescription,
};
