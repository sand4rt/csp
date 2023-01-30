import { expect, test } from '@playwright/test';
import type { SafeParseError, SafeParseSuccess } from 'zod';
import {
  FILE_TYPE,
  isXML,
  mt940File,
  type MT940File,
} from '@/domain/mt940File';

const fileTypes = Object.values(FILE_TYPE);

function createMock(overrides?: Partial<MT940File>): MT940File {
  const records = [
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

  return { type, content, ...overrides };
}

fileTypes.forEach((fileType) => {
  test(`create mt940 file from ${fileType}`, () => {
    const { success, data } = mt940File.safeParse(
      createMock({ type: fileType })
    ) as SafeParseSuccess<MT940File>;

    expect(success).toBe(true);
    expect(data).toMatchObject({
      type: fileType,
      content: [
        {
          reference: '183398',
          accountNumber: 'NL56RABO0149876948',
          description: 'Clothes from Richard de Vries',
          endBalance: '38.89',
          mutation: '+5.55',
          startBalance: '33.34',
        },
      ],
    });
  });
});

fileTypes.forEach((fileType) => {
  test(`invalid file format ${fileType}`, () => {
    const { error } = mt940File.safeParse(
      createMock({
        type: fileType,
        content: [null],
      })
    ) as SafeParseError<MT940File>;

    expect(error.issues).toHaveLength(1);
    expect(error.issues).toMatchObject([{ message: 'Invalid file format' }]);
  });
});

fileTypes.forEach((fileType) => {
  test(`contain at least one record ${fileType}`, () => {
    const { error } = mt940File.safeParse(
      createMock({ type: fileType, content: [] })
    ) as SafeParseError<MT940File>;

    expect(error.issues).toHaveLength(1);
    expect(error.issues).toMatchObject([{ message: 'Invalid file format' }]);
  });
});

test('invalid file type', () => {
  const { error } = mt940File.safeParse(
    createMock({ type: 'INVALID_FILE_TYPE' })
  ) as SafeParseError<MT940File>;

  expect(error.issues).toHaveLength(1);
  expect(error.issues).toMatchObject([
    { message: 'Only .xml and .csv files are allowed' },
  ]);
});
