import { addMinutes, addHours, format } from "date-fns";
import { prisma } from "../../shared/prisma";
import calculatePagination, { TOptions } from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
const insertToDB = async (payload: any) => {
  const { startTime, endTime, startDate, endDate } = payload;
  console.log({ startTime, endTime, startDate, endDate });
  const intervalTime = 30;

  const schedules = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const slotStartDateTime = startDateTime;
      const slotEndDateTime = addMinutes(startDateTime, intervalTime);

      const scheduleData = {
        startDateTime: slotStartDateTime,
        endDateTime: slotEndDateTime,
      };
      const existingSchedule = await prisma.schedule.findFirst({
        where: scheduleData,
      });
      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });

        schedules.push(result);
      }
      slotStartDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
      console.log(scheduleData);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};

const schedulesForDoctor = async (filters: any, options: TOptions) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime } =
    filters;
  const andCondition: Prisma.ScheduleWhereInput[] = [];

  if (filterStartDateTime && filterEndDateTime) {
    andCondition.push({
      AND: [
        {
          startDateTime: {
            gte: filterStartDateTime,
          },
          endDateTime: {
            lte: filterEndDateTime,
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andCondition.length > 0
      ? {
          AND: andCondition,
        }
      : {};

  const result = await prisma.schedule.findMany({
    where: whereConditions,
    skip,
    take: limit,
  });
  const total = await prisma.schedule.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteScheduleFromDB = async (id: string) => {
  return await prisma.schedule.delete({
    where: {
      id,
    },
  });
};
export const ScheduleService = {
  insertToDB,
  schedulesForDoctor,
  deleteScheduleFromDB,
};
