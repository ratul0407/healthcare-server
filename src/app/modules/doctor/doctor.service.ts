import { Doctor, Prisma } from "@prisma/client";
import calculatePagination, { TOptions } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constants";
import { prisma } from "../../shared/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";
import httpStatus from "http-status";
import ApiError from "../../errors/apiError";
import { openai } from "../../helper/openRouter";
import { extractJsonFromMessage } from "../../helper/extractJsonFromMsgs";
const getAllFromDB = async (filters: any, options: TOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;
  const andConditions: Prisma.DoctorWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: { equals: (filterData as any)[key] },
    }));
    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({ where: whereConditions });
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IDoctorUpdateInput>
) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: { id },
  });
  const { specialties, ...doctorData } = payload;

  return await prisma.$transaction(async (tnx) => {
    if (specialties && specialties.length > 0) {
      const deleteSpecialtiesIds = specialties.filter(
        (specailty) => specailty.isDeleted
      );
      const createSepcialtiesIds = specialties.filter(
        (specailty) => !specailty.isDeleted
      );

      for (const specialtyId of deleteSpecialtiesIds) {
        await tnx.doctorSpecialties.deleteMany({
          where: { doctorId: id, specialtiesId: specialtyId.specialtyId },
        });
      }

      for (const specialtyId of createSepcialtiesIds) {
        await tnx.doctorSpecialties.create({
          data: {
            doctorId: id,
            specialtiesId: specialtyId.specialtyId,
          },
        });
      }
    }
    const updatedData = await prisma.doctor.update({
      where: { id: doctorInfo.id },
      data: doctorData,
      include: {
        doctorSpecialties: {
          include: {
            specialties: true,
          },
        },
      },
    });
    return updatedData;
  });
};

const suggestion = async (payload: { symptoms: string }) => {
  console.log(payload, payload.symptoms, payload.symptoms.length);
  if (!payload || !payload.symptoms || payload.symptoms.length <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "symptoms are required!");
  }
  const doctors = await prisma.doctor.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  const prompt = `You are a medical assistant AI. based on patients symptoms, suggest top 3 most suitable doctors. Each doctor has specialties and years of experience. Only suggest doctors who are relevant to the symptoms. 
  
  Symptoms: ${payload.symptoms}
  Here is the doctors list in JSON format: ${JSON.stringify(doctors, null, 2)}
  Return yours response in JSON format with full individual doctor data. 
  `;
  const completion = await openai.chat.completions.create({
    model: "z-ai/glm-4.5-air:free",
    messages: [
      {
        role: "system",
        content:
          "You are a medical assistant AI that provides doctors suggestions.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const result = await extractJsonFromMessage(completion.choices[0].message);
  return result;
};
const getById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id, isDeleted: false },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
    },
  });
  return doctor;
};
export const DoctorService = {
  getAllFromDB,
  updateIntoDB,
  suggestion,
  getById,
};
