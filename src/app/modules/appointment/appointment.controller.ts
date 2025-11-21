import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJwtPayload } from "../../types/common";
import sendResponse from "../../shared/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { AppointmentService } from "./appointment.service";
import pick from "../../helper/pick";

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

const getMyAppointments = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const user = req.user;
    const result = await AppointmentService.getMyAppointments(
      user as IJwtPayload,
      filters,
      options
    );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Appointments retrieved successfully!",
      data: result,
    });
  }
);
const updateAppointmentStatus = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;
    const result = await AppointmentService.updateAppointmentStatus(
      req.params.id,
      req.body.status,
      user as IJwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Appointment status updated successfully!",
      data: result,
    });
  }
);
export const AppointemntController = {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
};
