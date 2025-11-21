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
export const PrescriptionService = {
  createPrescription,
};
