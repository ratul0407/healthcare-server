import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { jwtHelpers } from "../../helper/jwtHelper";
import ApiError from "../../errors/apiError";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
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
    config.access_secret as Secret,
    config.access_expires as string
  );

  const refreshToken = jwtHelpers.generateToken(
    { email: user.email, role: user.role },
    config.refresh_secret as Secret,
    config.refresh_expires as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const getMe = async (session: any) => {
  const accessToken = session.accessToken;
  const decoded = jwtHelpers.verifyToken(
    accessToken,
    config.access_secret as Secret
  );

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decoded.email,
      status: UserStatus.ACTIVE,
    },
  });
  const { id, email, role, needPasswordChange, status } = userData;
  return { id, email, role, needPasswordChange, status };
};
export const AuthService = {
  login,
  getMe,
};
