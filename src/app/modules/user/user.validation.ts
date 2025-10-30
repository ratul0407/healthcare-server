import z from "zod";
const createPatientValidationSchema = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required"),
    address: z.string().optional(),
  }),
});

const createDoctorValidationSchema = z.object({
  password: z.string(),
  doctor: z.object({
    name: z.string().nonempty("Name is required"),
    contactNumber: z.string().nonempty("Contact Number is required"),
    address: z.string().nonempty("Address is required"),
    registrationNumber: z.string().nonempty("Registration number is required"),
    experience: z.int().nonnegative().optional(),
    gender: z.enum(["Male", "FEMALE"]).nonoptional(),
    appointmentFee: z.int().nonnegative().nonoptional(),
    qualification: z.string().nonempty("Qualification is required"),
    currentWorkingPlace: z
      .string()
      .nonempty("Current working place is required"),
    designation: z.string().nonempty("Designation required"),
  }),
});
export const UserValidation = {
  createPatientValidationSchema,
  createDoctorValidationSchema,
};
