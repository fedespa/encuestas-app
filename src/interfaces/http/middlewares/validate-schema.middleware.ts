import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateSchema = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Error en los datos!"
      });
    }

    req.body = parsed.data;
    next();
  };
};
