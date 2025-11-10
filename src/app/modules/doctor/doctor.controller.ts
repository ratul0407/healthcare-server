import pick from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorFilterableFields } from "./doctor.constants";
import { DoctorService } from "./doctor.service";

const getAllFromDB = catchAsync(async (req, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, doctorFilterableFields);
  const result = await DoctorService.getAllFromDB(options, filters);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Doctors retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const DoctorController = {
  getAllFromDB,
};
