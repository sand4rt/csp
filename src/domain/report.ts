import { z } from 'zod';
import { type MT940File, mt940File } from '@/domain/mt940File';
import { transactionRecords } from '@/domain/transactionRecords';

const issues = z
  .object({
    data: z.array(
      z.object({
        reference: z.any(),
        accountNumber: z.any(),
        description: z.any(),
        startBalance: z.any(),
        mutation: z.any(),
        endBalance: z.any(),
      })
    ),
    issues: z.array(
      z.object({
        path: z.array(z.any(), z.any()),
        message: z.string(),
      })
    ),
  })
  .transform((error) => {
    return error.issues.map((issue) => {
      return {
        ...error.data.at(issue.path.at(0)),
        error: issue.message,
      };
    });
  });

export type Report = ReturnType<typeof createReport>['report'];
export function createReport(request: MT940File) {
  const file = mt940File.safeParse(request);

  if (!file.success) return { errorType: 'invalid-file', report: [] };

  const records = transactionRecords.safeParse(file.data.content);
  if (records.success) return { errorType: 'valid', report: [] };

  const reportModel = issues.safeParse({
    data: file.data.content,
    issues: records.error.issues,
  });

  if (!reportModel.success) return { errorType: 'invalid-file', report: [] };

  return { errorType: 'invalid-records', report: reportModel.data };
}
