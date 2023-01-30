import { Description } from '@/components/Description';
import { Highlight } from '@/components/Highlight';
import { Logo } from '@/components/Logo';

export function InitialView() {
  return (
    <main className="max-w-md bg-gray-100 px-5">
      <Logo className="mx-auto mb-9 mt-10" />
      <Description>
        Validate customer statement records by uploading a&nbsp;
        <Highlight>.CSV</Highlight> or an&nbsp;
        <Highlight>.XML</Highlight> file in&nbsp;
        <Highlight>MT940</Highlight> format.
      </Description>
    </main>
  );
}
