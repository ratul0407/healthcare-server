import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../helper/jwtHelper";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        throw new Error("You are not authorized");
      }
      const verifyUser = jwtHelpers.verifyToken(token, "jsonwebtoken");
      req.user = verifyUser;
      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new Error("You are not authorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
