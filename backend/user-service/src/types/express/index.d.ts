import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload & { _id?: string; email?: string };
    }
  }
}

export {};
