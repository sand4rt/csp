import { UploadButton } from '@/components/UploadButton';
import { test, expect } from '@playwright/experimental-ct-react';
import type { Page } from '@playwright/test';

async function uploadFile(filename: string, page: Page) {
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByText('Upload Records').click(),
  ]);
  await fileChooser.setFiles(`mocks/${filename}`);
}

test('upload the same file twice', async ({ mount, page }) => {
  const files: File[] = [];
  await mount(<UploadButton onFileSelect={(file) => files.push(file)} />);

  await uploadFile('valid.xml', page);
  await uploadFile('valid.xml', page);

  expect(files).toHaveLength(2);
});

test('hide file input from non-screen readers', async ({ mount }) => {
  const component = await mount(<UploadButton onFileSelect={() => null} />);
  await expect(component.getByRole('textbox')).toHaveClass('sr-only');
});
