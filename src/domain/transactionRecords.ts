import { z } from 'zod';
import { transactionRecord } from '@/domain/transactionRecord';

export type TransactionRecords = z.infer<typeof transactionRecords>;

export const transactionRecords = z
  .array(transactionRecord)
  .min(1, { message: 'Must contain at least one record' })
  .superRefine((records, context) => {
    const map = new Map<string, boolean>();
    records.forEach((record, index) => {
      const reference = record.reference.toString();

      if (!map.get(reference)) {
        return map.set(reference, true);
      }

      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [index, 'reference'],
        message: 'Duplicate record',
      });
    });
  });
