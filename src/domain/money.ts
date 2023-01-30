import { z } from 'zod';
import { Decimal } from 'decimal.js';

export type Money = z.infer<typeof money>;

export const money = z
  .string()
  .or(z.number())
  .refine((value) => {
    try {
      return new Decimal(value);
    } catch (error) {
      return false;
    }
  }, 'Must be a valid amount')
  .transform((value) => new Decimal(value));
