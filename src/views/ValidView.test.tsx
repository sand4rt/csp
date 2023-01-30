import { expect, test } from '@playwright/experimental-ct-react';
import { ValidView } from '@/views/ValidView';
import type { HooksConfig } from 'playwright';

test('render valid view', async ({ mount }) => {
  const component = await mount<HooksConfig>(<ValidView />, {
    hooksConfig: {
      layoutContext: { filename: 'records.xml' },
    },
  });
  await expect(component.getByTestId('success-icon')).toBeVisible();
  await expect(component.getByRole('paragraph')).toContainText('records.xml');
});
