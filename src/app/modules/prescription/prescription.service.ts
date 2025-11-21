import {
  AppointmentStatus,
  PaymentStatus,
  Prescription,
  UserRole,
} from "@prisma/client";
import { IJwtPayload } from "../../types/common";
import { prisma } from "../../shared/prisma";
import ApiError from "../../errors/apiError";
import httpStatus from "http-status";
import calculatePagination, { TOptions } from "../../helper/paginationHelper";
const createPrescription = async (
  user: IJwtPayload,
  payload: Partial<Prescription>
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
      patient: true,
    },
  });
  if (user.role === UserRole.DOCTOR) {
    if (!(user.email === appointmentData.doctor.email)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "This is not your appointment"
      );
    }
  }
  return await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctor.id,
      patientId: appointmentData.patient.id,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || null,
    },
    include: {
      patient: true,
    },
  });
};
const myPrescriptions = async (user: IJwtPayload, options: TOptions) => {
  const { limit, page, skip } = calculatePagination(options);
  const result = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user.email,
      },
    },
    skip,
    take: limit,
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });
  const total = await prisma.prescription.count({
    where: {
      patient: {
        email: user.email,
      },
    },
  });
  return {
    meta: { total, page, limit },
    data: result,
  };
};
export const PrescriptionService = {
  createPrescription,
  myPrescriptions,
};
