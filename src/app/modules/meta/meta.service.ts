import { PaymentStatus, UserRole } from "@prisma/client";
import { IJwtPayload } from "../../types/common";
import ApiError from "../../errors/apiError";
import httpStatus from "http-status";
import { prisma } from "../../shared/prisma";
const fetchDashboardMetaData = async (user: IJwtPayload) => {
  let metaData;
  switch (user.role) {
    case UserRole.ADMIN: {
      metaData = getAdminMetaData();
      break;
    }
    case UserRole.DOCTOR: {
      metaData = "Doctor metadata";
      break;
    }
    case UserRole.PATIENT: {
      metaData = "Patient metadata";
      break;
    }
    default: {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user role");
    }
  }
  return metaData;
};

const getAdminMetaData = async () => {
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const appointmentCount = await prisma.appointment.count();
  const scheduleCount = await prisma.schedule.count();
  const doctorScheduleCount = await prisma.doctorSchedules.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });
  const barchartData = await getBarChartData();
  const pieChartData = await getPieChartData();
  return {
    patientCount,
    doctorCount,
    appointmentCount,
    scheduleCount,
    doctorScheduleCount,
    paymentCount,
    totalRevenue,
    barchartData,
    pieChartData,
  };
};
const getBarChartData = async () => {
  const appointmentCountPerMonth = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") as month,
    CAST(COUNT(*) as INT) as count 
    FROM "appointments"
    GROUP BY month 
    ORDER BY month ASC
    `;
  return appointmentCountPerMonth;
};

const getPieChartData = async () => {
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });
  const formattedData = appointmentStatusDistribution.map(
    ({ status, _count }) => ({
      status,
      count: Number(_count.id),
    })
  );
  return formattedData;
};

const getDoctorMetaData = async (user: IJwtPayload) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: {
      id: true,
    },
  });
  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });
  const revenueCount = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status: PaymentStatus.PAID,
    },
  });
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      doctorId: doctorData.id,
    },
  });
  const formattedData = appointmentStatusDistribution.map(
    ({ status, _count }) => ({
      status,
      count: Number(_count.id),
    })
  );
  return {
    appointmentCount,
    patientCount: patientCount.length,
    reviewCount,
    revenueCount,
    appointmentStatusDistribution: formattedData,
  };
};
export const MetaService = { fetchDashboardMetaData };
