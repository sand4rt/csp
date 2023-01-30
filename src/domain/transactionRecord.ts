import { z } from 'zod';
import { money } from '@/domain/money';

export type TransactionRecord = z.infer<typeof transactionRecord>;

export const transactionRecord = z
  .object({
    reference: z
      .string({ description: 'Reference must be text or a number' })
      .min(1, 'Reference is empty')
      .or(
        z.number({ invalid_type_error: 'Reference must be text or a number' })
      ),
    accountNumber: z
      .string({ invalid_type_error: 'Account number must be text' })
      .min(1, 'Account number is empty')
      .max(34, 'Account number is invalid'), // TODO: add proper IBAN validation
    description: z
      .string({
        invalid_type_error: 'Description must be text',
      })
      .optional(),
    startBalance: money,
    mutation: money,
    endBalance: money,
  })
  .refine(
    ({ startBalance, mutation, endBalance }) => {
      if (mutation.isNegative()) {
        return startBalance.minus(mutation.abs()).eq(endBalance);
      }
      return startBalance.plus(mutation).eq(endBalance);
    },
    { message: 'Invalid end balance', path: ['endBalance'] }
  )
  .transform((record) => {
    return {
      ...record,
      startBalance: record.startBalance.toFixed(),
      mutation: record.mutation.toFixed(),
      endBalance: record.endBalance.toFixed(),
    };
  });
