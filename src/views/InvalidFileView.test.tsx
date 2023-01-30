import { expect, test } from '@playwright/experimental-ct-react';
import { InvalidFileView } from '@/views/InvalidFileView';
import type { HooksConfig } from 'playwright';

test('render invalid file view', async ({ mount }) => {
  const component = await mount<HooksConfig>(<InvalidFileView />, {
    hooksConfig: {
      layoutContext: { filename: 'records.csv' },
    },
  });
  await expect(component.getByTestId('error-icon')).toBeVisible();
  await expect(component.getByRole('paragraph')).toContainText('records.csv');
});
