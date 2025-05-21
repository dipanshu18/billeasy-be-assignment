import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { loginSchema, signupSchema } from "../zodSchemas/auth";
import { db } from "../utils/db";
import { JWT_SECRET } from "../constants/env";

export async function signup(req: Request, res: Response) {
  try {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      res.status(422).json({
        message: "Please provide all valid fields values",
      });
      return;
    }

    const { username, email, password } = result.data;

    const userExists = await db.user.findUnique({
      where: {
        username,
        email,
      },
    });

    if (userExists) {
      res.status(400).json({
        message:
          "User already exists with email/username. Kindly login or use different credentials",
      });
      return;
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        password: hashPassword,
        username,
      },
    });

    if (!newUser) {
      res.status(400).json({
        message: "Could not able to create user with given inputs",
      });
      return;
    }

    const token = jwt.sign({ uid: newUser.id }, JWT_SECRET);

    res.status(201).json({
      message: "User created",
      token,
    });
    return;
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Something went wrong while signup",
    });
    return;
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(422).json({
        message: "Please provide all valid fields values",
      });
      return;
    }

    const { username, password } = result.data;

    const userExists = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (!userExists) {
      res.status(400).json({
        message: "User not exists with username. Kindly register first",
      });
      return;
    }

    const verifyPassword = bcrypt.compareSync(
      password,
      userExists?.password as string
    );

    if (!verifyPassword) {
      res.status(400).json({
        message: "Incorrect login credentials",
      });
      return;
    }

    const token = jwt.sign({ uid: userExists.id }, JWT_SECRET);

    res.status(200).json({
      message: "Credentials verified",
      token,
    });
    return;
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Something went wrong while login",
    });
    return;
  }
}

export async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("token");

    res.status(200).json({
      message: "Logged out!",
    });
    return;
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Something went wrong while logging out",
    });
    return;
  }
}
