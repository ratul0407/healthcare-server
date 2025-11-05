import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";

const insertToDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleService.insertToDB(req.body);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Inserted to db",
      data: result,
    });
  }
);

const schedulesForDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, ["startDateTime", "endDateTime"]);
    const result = await ScheduleService.schedulesForDoctor(filters, options);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Schedule for doctor",
      data: result,
    });
  }
);
export const ScheduleController = {
  insertToDB,
  schedulesForDoctor,
};
