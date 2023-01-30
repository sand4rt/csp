import { expect, test } from '@playwright/test';
import type { SafeParseError, SafeParseSuccess } from 'zod';
import type { TransactionRecords } from '@/domain/transactionRecords';
import { transactionRecords } from '@/domain/transactionRecords';

type TransactionRecord = TransactionRecords[0];

function createMock(overrides?: Partial<TransactionRecord>): TransactionRecord {
  return {
    reference: '324432',
    accountNumber: 'NL32RABO0195610843',
    description: 'Subscription from Vincent de Vries',
    startBalance: '1',
    mutation: '1',
    endBalance: '2',
    ...overrides,
  };
}

test('create transaction records', () => {
  const { success, data } = transactionRecords.safeParse([
    createMock(),
    createMock({ reference: '424242' }),
  ]) as SafeParseSuccess<TransactionRecords>;

  expect(success).toBe(true);
  expect(data).toMatchObject([
    {
      accountNumber: 'NL32RABO0195610843',
      description: 'Subscription from Vincent de Vries',
      endBalance: '2',
      mutation: '1',
      reference: '324432',
      startBalance: '1',
    },
    {
      accountNumber: 'NL32RABO0195610843',
      description: 'Subscription from Vincent de Vries',
      endBalance: '2',
      mutation: '1',
      reference: '424242',
      startBalance: '1',
    },
  ]);
});

test('contain at least one record', () => {
  const { error } = transactionRecords.safeParse(
    []
  ) as SafeParseError<TransactionRecords>;

  expect(error.issues).toHaveLength(1);
  expect(error.issues).toMatchObject([
    { message: 'Must contain at least one record' },
  ]);
});

test('unique records', () => {
  const { error } = transactionRecords.safeParse([
    createMock({ reference: '1337' }),
    createMock({ reference: '1337' }),
  ]) as SafeParseError<TransactionRecords>;

  expect(error.issues).toHaveLength(1);
  expect(error.issues).toMatchObject([{ message: 'Duplicate record' }]);
});
