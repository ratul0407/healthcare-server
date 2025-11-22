import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJwtPayload } from "../../types/common";
import sendResponse from "../../shared/sendResponse";
import { MetaService } from "./meta.service";

const fetchDashboardMetaData = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    console.log(req.user);
    const result = await MetaService.fetchDashboardMetaData(
      req.user as IJwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Dashboard meta data fetched successfully!",
      data: result,
    });
  }
);
export const MetaController = {
  fetchDashboardMetaData,
};
