import test, { expect } from '@playwright/test';
import { createReport } from '@/domain/report';
import type { MT940File } from '@/domain/mt940File';
import { FILE_TYPE, isXML } from '@/domain/mt940File';

function createMock(overrides?: Partial<MT940File>): MT940File {
  const records = overrides?.content ?? [
    {
      reference: '183398',
      accountNumber: 'NL56RABO0149876948',
      description: 'Clothes from Richard de Vries',
      endBalance: '38.89',
      mutation: '+5.55',
      startBalance: '33.34',
    },
  ];
  const type = overrides?.type || FILE_TYPE.TEXT_CSV;
  const content = isXML(type) ? { records: { record: records } } : records;

  return { type, content };
}

const fileTypes = Object.values(FILE_TYPE);

fileTypes.forEach((fileType) => {
  test(`create valid file report from ${fileType}`, () => {
    const { errorType } = createReport(
      createMock({
        type: 'INVALID_FILE',
      })
    );

    expect(errorType).toBe('invalid-file');
  });
});

fileTypes.forEach((fileType) => {
  test(`create valid report from ${fileType}`, () => {
    const { errorType } = createReport(
      createMock({
        type: fileType,
      })
    );

    expect(errorType).toBe('valid');
  });
});

fileTypes.forEach((fileType) => {
  test(`create valid records report from ${fileType}`, () => {
    const { errorType } = createReport(
      createMock({
        type: fileType,
        content: [
          {
            reference: '183398',
            accountNumber: 'NL56RABO0149876948',
            description: 'Clothes from Richard de Vries',
            endBalance: '10000000000',
            mutation: '+5.55',
            startBalance: '33.34',
          },
        ],
      })
    );

    expect(errorType).toBe('invalid-records');
  });
});
