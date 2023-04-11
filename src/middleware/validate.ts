import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// This function is for validating the use input based on the schema
export const validate =
  (schema: z.AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
      });
      next();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          status: 'fail',
          error: err.errors,
        });
      }
      next(err);
    }
  };
