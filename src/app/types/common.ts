import { UserRole } from "@prisma/client";

export interface IJwtPayload {
  email: string;
  role: UserRole;
}
