import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";

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

export const ScheduleController = {
  insertToDB,
};
