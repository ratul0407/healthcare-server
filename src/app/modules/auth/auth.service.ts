import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { jwtHelpers } from "../../helper/jwtHelper";
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
    throw new Error("Password is incorrect");
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
