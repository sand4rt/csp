import { expect, test } from '@playwright/test';
import type { SafeParseError, SafeParseSuccess } from 'zod';
import type { TransactionRecord } from '@/domain/transactionRecord';
import { transactionRecord } from '@/domain/transactionRecord';

function createMock(overrides?: Partial<TransactionRecord>): TransactionRecord {
  return {
    reference: '324432',
    accountNumber: 'NL32RABO0195610843',
    description: 'Subscription from Vincent de Vries',
    startBalance: '0',
    mutation: '0',
    endBalance: '0',
    ...overrides,
  };
}

test('create transaction record', () => {
  const { success, data } = transactionRecord.safeParse(
    createMock()
  ) as SafeParseSuccess<TransactionRecord>;

  expect(success).toBe(true);
  expect(data).toMatchObject({
    accountNumber: 'NL32RABO0195610843',
    description: 'Subscription from Vincent de Vries',
    endBalance: '0',
    mutation: '0',
    reference: '324432',
    startBalance: '0',
  });
});

test.describe('reference', () => {
  test('contain at least one character', () => {
    const { error } = transactionRecord.safeParse(
      createMock({ reference: '' })
    ) as SafeParseError<TransactionRecord>;

    expect(error.issues).toHaveLength(1);
    expect(error.issues).toMatchObject([{ message: 'Reference is empty' }]);
  });
});

test.describe('account number', () => {
  test('contain at least one character', () => {
    const { error } = transactionRecord.safeParse(
      createMock({ accountNumber: '' })
    ) as SafeParseError<TransactionRecord>;

    expect(error.issues).toHaveLength(1);
    expect(error.issues).toMatchObject([
      { message: 'Account number is empty' },
    ]);
  });

  test('max amount of characters character', () => {
    const { error } = transactionRecord.safeParse(
      createMock({ accountNumber: '_ACCOUNT_NUMBER_THAT_IS_WAY_TO_LONG_' })
    ) as SafeParseError<TransactionRecord>;

    expect(error.issues).toHaveLength(1);
    expect(error.issues).toMatchObject([
      { message: 'Account number is invalid' },
    ]);
  });

  test('number must be text', () => {
    const { error } = transactionRecord.safeParse({
      ...createMock(),
      accountNumber: 1,
    }) as SafeParseError<TransactionRecord>;

    expect(error.issues).toHaveLength(1);
    expect(error.issues).toMatchObject([
      { message: 'Account number must be text' },
    ]);
  });
});

test.describe('description ', () => {
  test('must be in text', () => {
    const { error } = transactionRecord.safeParse({
      ...createMock(),
      description: 0,
    }) as SafeParseError<TransactionRecord>;

    expect(error.issues).toHaveLength(1);
    expect(error.issues).toMatchObject([
      { message: 'Description must be text' },
    ]);
  });
});

test.describe('end balance', () => {
  test('invalid end balance', () => {
    const { error } = transactionRecord.safeParse(
      createMock({ startBalance: '0', mutation: '1', endBalance: '0' })
    ) as SafeParseError<TransactionRecord>;

    expect(error.issues).toHaveLength(1);
    expect(error.issues).toMatchObject([{ message: 'Invalid end balance' }]);
  });

  test('valid when depositing money', () => {
    const { success } = transactionRecord.safeParse(
      createMock({ startBalance: '0', mutation: '1', endBalance: '1' })
    );
    expect(success).toBe(true);
  });

  test('valid with a zero mutation', () => {
    const { success } = transactionRecord.safeParse(
      createMock({ startBalance: '0', mutation: '0', endBalance: '0' })
    );
    expect(success).toBe(true);
  });

  test('valid when withdrawing money', () => {
    const { success } = transactionRecord.safeParse(
      createMock({ startBalance: '0', mutation: '-1', endBalance: '-1' })
    );
    expect(success).toBe(true);
  });

  test('take IEEE Floating-Point Arithmetic into account', () => {
    const { success } = transactionRecord.safeParse(
      createMock({
        startBalance: '9.14',
        mutation: '-2.12',
        endBalance: '7.02',
      })
    );

    expect(success).toBe(true);
  });
});
