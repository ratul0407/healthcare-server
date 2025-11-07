import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import { IJwtPayload } from "../../types/common";

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
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, ["startDateTime", "endDateTime"]);
    const user = req.user;
    const result = await ScheduleService.schedulesForDoctor(
      user as IJwtPayload,
      filters,
      options
    );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Schedules fetched successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

const deleteScheduleFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleService.deleteScheduleFromDB(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "deleted schedule successfully!",
      data: result,
    });
  }
);
export const ScheduleController = {
  insertToDB,
  schedulesForDoctor,
  deleteScheduleFromDB,
};
