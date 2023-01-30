import { expect, test } from '@playwright/experimental-ct-react';
import { InvalidRecordsView } from '@/views/InvalidRecordsView';
import type { Report } from '@/domain/report';
import type { HooksConfig } from 'playwright';

type ReportLine = Report[0];

function createReportLine(overrides: Partial<ReportLine>): ReportLine {
  return {
    reference: '011011',
    accountNumber: 'NL93ABNA0585619023',
    description: 'Candy from Vincent de Vries',
    startBalance: '5429',
    mutation: '-939',
    endBalance: '6368',
    error: 'Duplicate record',
    ...overrides,
  };
}

async function streamToString<T>(stream: T) {
  const chunks = [];
  for await (const chunk of stream as ArrayBuffer[]) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf-8');
}

test('download report', async ({ mount, page }) => {
  const component = await mount<HooksConfig>(<InvalidRecordsView />, {
    hooksConfig: {
      layoutContext: {
        filename: 'records.xml',
        report: [
          createReportLine({ reference: '011011', error: 'Duplicate record' }),
        ],
      },
    },
  });

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    component.getByRole('button', { name: 'download' }).click(),
  ]);

  const steam = await download.createReadStream();
  const fileContent = await streamToString(steam);

  expect(download.suggestedFilename()).toBe('records.csv');
  expect(fileContent).toBe(
    'reference,accountNumber,description,startBalance,mutation,endBalance,error\n' +
      '011011,NL93ABNA0585619023,Candy from Vincent de Vries,5429,-939,6368,Duplicate record'
  );
});

test('render invalid records view', async ({ mount }) => {
  const component = await mount<HooksConfig>(<InvalidRecordsView />, {
    hooksConfig: {
      layoutContext: {
        filename: 'records.xml',
        report: [
          createReportLine({ reference: '011011', error: 'Duplicate record' }),
          createReportLine({ reference: '1337', error: 'Invalid end balance' }),
          createReportLine({ reference: '8', error: 'Invalid account number' }),
        ],
      },
    },
  });

  await test.step('description', async () => {
    const description = component.getByRole('paragraph');
    await expect(description).toContainText('records.xml');
    await expect(description).toContainText(
      '3 Invalid customer statement record(s)'
    );
  });

  await test.step('report', async () => {
    await expect(component.getByRole('table').getByRole('row')).toHaveCount(4); // including header

    function getTableCell(name: string) {
      return component.getByRole('table').getByRole('cell', { name });
    }

    await expect(getTableCell('011011')).toBeVisible();
    await expect(getTableCell('Duplicate record')).toBeVisible();

    await expect(getTableCell('1337')).toBeVisible();
    await expect(getTableCell('Invalid end balance')).toBeVisible();

    await expect(getTableCell('8')).toBeVisible();
    await expect(getTableCell('Invalid account number')).toBeVisible();
  });
});

test('render a fallback char when reference is empty', async ({ mount }) => {
  const component = await mount<HooksConfig>(<InvalidRecordsView />, {
    hooksConfig: {
      layoutContext: {
        filename: 'records.xml',
        report: [createReportLine({ reference: '' })],
      },
    },
  });

  await expect(component.getByRole('cell', { name: '-' })).toBeVisible();
});
