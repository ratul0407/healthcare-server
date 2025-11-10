import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { jwtHelpers } from "../../helper/jwtHelper";
import ApiError from "../../errors/apiError";
const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is incorrect");
  }

  const accessToken = jwtHelpers.generateToken(
    { email: user.email, role: user.role },
    "jsonwebtoken",
    "1h"
  );

  const refreshToken = jwtHelpers.generateToken(
    { email: user.email, role: user.role },
    "jsonwebtoken",
    "90d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const AuthService = {
  login,
};
