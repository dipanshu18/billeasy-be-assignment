import type { Request } from "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
    }; // Extend Request with a 'user' property
  }
}
