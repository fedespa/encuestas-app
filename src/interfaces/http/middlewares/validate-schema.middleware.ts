import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateSchema = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      const formattedErrors = parsed.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path.join("."), 
        code: issue.code,
      }));

      return res.status(400).json({
        error: "Invalid request body",
        details: formattedErrors
      });
    }

    req.body = parsed.data;
    next();
  };
};
