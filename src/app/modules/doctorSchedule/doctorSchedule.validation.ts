import z from "zod";

const createDoctorScheduleValidation = z.object({
    body: z.object({
        scheduleIds: z.array(z.string()).nonempty("Schedule IDs are required"),
    })
});

export const DoctorScheduleValidation = {
    createDoctorScheduleValidation,
}