import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createPatient(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient created successfully!",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createDoctor(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor created successfully!",
    data: result,
  });
});

export const userController = {
  createPatient,
  createDoctor,
};
