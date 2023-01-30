import { expect, test } from '@playwright/experimental-ct-react';
import { LoadingView } from '@/views/LoadingView';

test('render loading view', async ({ mount }) => {
  const component = await mount(<LoadingView />);
  await expect(component.getByRole('status')).toBeVisible();
  await expect(
    component.getByText('records are being validated')
  ).toBeVisible();
});
