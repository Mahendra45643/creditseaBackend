// server/src/middlewares/asyncHandler.ts
import { Request, Response, NextFunction } from "express";

/**
 * Async handler to wrap async functions in Express routes
 * @param fn Async function to be wrapped
 */
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
