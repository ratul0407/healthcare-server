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

const updateIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorService.updateIntoDB(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Doctor updated successfully!",
    data: result,
  });
});

const suggestion = catchAsync(async (req, res) => {
  const result = await DoctorService.suggestion(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "AI suggestions fetched successfully!",
    data: result,
  });
});
const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorService.getById(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Doctor retrieved successfully!",
    data: result,
  });
});
export const DoctorController = {
  getAllFromDB,
  updateIntoDB,
  suggestion,
  getById,
};
