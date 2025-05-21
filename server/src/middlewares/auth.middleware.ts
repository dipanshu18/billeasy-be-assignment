import type { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../constants/env";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { token } = req.cookies;

  if (!token) {
    res.status(401).json({
      message: "Unauthorized, no auth token passed",
    });
    return;
  }

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  if (!decoded) {
    res.status(401).json({
      message: "Unauthorized, invalid token",
    });
    return;
  }

  const { uid } = decoded;
  req.user = { id: uid };
  next();
}
