import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJwtPayload } from "../../types/common";
import { ReviewService } from "./review.service";
import sendResponse from "../../shared/sendResponse";

const intertToDb = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;
    const result = await ReviewService.insertIntoDb(user, req.body);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Review inserted successfully!",
      data: result,
    });
  }
);

export const ReviewController = {
  intertToDb,
};
