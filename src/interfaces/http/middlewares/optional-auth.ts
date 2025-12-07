import type { Request, Response, NextFunction } from "express";
import type { JwtService } from "../../../application/services/jwt.service.js";

export const optionalAuth = (jwtService: JwtService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER", authHeader)

    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.replace("Bearer ", "");

    try {
      const payload = await jwtService.verifyAccessToken(token);
      req.user = payload;
    } catch {
      req.user = null;
    }

    next();
  };
};
