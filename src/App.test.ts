import { type Page, test, expect } from '@playwright/test';
import { FILE_TYPE } from '@/domain/mt940File';

const fileExtensions = new Set(
  Object.values(FILE_TYPE).map((fileType) => fileType.split('/').at(1))
);

async function uploadFile(filename: string, page: Page) {
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByText('Upload Records').click(),
  ]);
  await fileChooser.setFiles(`mocks/${filename}`);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

fileExtensions.forEach((extension) => {
  test(`upload valid ${extension} file`, async ({ page }) => {
    await uploadFile(`valid.${extension}`, page);
    await expect(page.getByTestId('success-icon')).toBeVisible();
  });
});

fileExtensions.forEach((extension) => {
  test(`upload invalid ${extension} file`, async ({ page }) => {
    await uploadFile(`invalid-format.${extension}`, page);
    await expect(page.getByTestId('error-icon')).toBeVisible();
  });
});

fileExtensions.forEach((extension) => {
  test(`upload ${extension} file validation errors`, async ({ page }) => {
    await uploadFile(`invalid.${extension}`, page);
    const getByCell = (name: string) => page.getByRole('cell', { name });
    await expect(getByCell('Invalid end balance')).toBeVisible();
    await expect(getByCell('Account number is empty')).toBeVisible();
    await expect(getByCell('Reference is empty')).toBeVisible();
    await expect(getByCell('Duplicate record')).toBeVisible();
  });
});

fileExtensions.forEach((extension) => {
  test.fixme(`upload large ${extension} file`, async ({ page }) => {
    await uploadFile(`large.${extension}`, page);
    await expect(page.getByText('records are being validated')).toBeVisible();
    await expect(page.getByTestId('success-icon')).toBeVisible({
      timeout: 30000,
    });
  });
});

test('upload multiple files in succession', async ({ page }) => {
  await uploadFile('valid.csv', page);
  await expect(page.getByTestId('success-icon')).toBeVisible();
  await uploadFile('invalid-format.xml', page);
  await expect(page.getByTestId('error-icon')).toBeVisible();
  await uploadFile('invalid.csv', page);
  await expect(
    page.getByRole('cell', { name: 'invalid end balance' })
  ).toBeVisible();
});

test('reloading the page redirects to initial screen', async ({ page }) => {
  await uploadFile('valid.csv', page);
  await page.reload();
  await expect(
    page.getByText('Validate customer statement records')
  ).toBeVisible();
});
