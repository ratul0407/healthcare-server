import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJwtPayload } from "../../types/common";
import sendResponse from "../../shared/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { AppointmentService } from "./appointment.service";

const createAppointment = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;
    const result = await AppointmentService.createAppointment(
      user as IJwtPayload,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Appointment created successfully!",
      data: result,
    });
  }
);
export const AppointemntController = {
  createAppointment,
};
