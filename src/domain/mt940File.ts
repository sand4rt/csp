import { z } from 'zod';

export const FILE_TYPE = {
  TEXT_XML: 'text/xml',
  APPLICATION_XML: 'application/xml',
  TEXT_CSV: 'text/csv',
} as const;

export type FileType = (typeof FILE_TYPE)[keyof typeof FILE_TYPE];

export function isXML(type: string) {
  return type === FILE_TYPE.TEXT_XML || type === FILE_TYPE.APPLICATION_XML;
}

export type MT940File = z.infer<typeof mt940File>;

export const mt940File = z
  .object({
    type: z.any().superRefine((type, context) => {
      if (!Object.values(FILE_TYPE).includes(type)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Only .xml and .csv files are allowed',
          fatal: true,
        });
      }
    }),
    content: z.any(),
  })
  .transform((file, context) => {
    const fileContent = isXML(file.type)
      ? mt940XmlFileContent
      : mt940CsvFileContent;

    const mt940FileContent = fileContent.safeParse(file.content);
    if (!mt940FileContent.success) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid file format',
        fatal: true,
      });
    }

    return {
      type: file.type,
      content: (mt940FileContent as Record<string, unknown>).data,
    };
  });

const mt940XmlFileContent = z
  .object({
    records: z.object({
      record: z.array(z.record(z.any())).min(1).or(z.record(z.any())),
    }),
  })
  .transform((file) => {
    const records = file.records.record;
    if (Array.isArray(records)) {
      return records;
    }
    return [records];
  });

const mt940CsvFileContent = z.array(z.record(z.any())).min(1);
