import { Description } from '@/components/Description';
import { Highlight } from '@/components/Highlight';
import { LogoText } from '@/components/LogoText';
import { SuccessIcon } from '@/components/SuccessIcon';
import { useLayout } from '@/layout';

export function ValidView() {
  const { filename } = useLayout();

  return (
    <main className="max-w-md bg-gray-100 px-5">
      <LogoText />
      <SuccessIcon className="mx-auto mt-20" />
      <Description className="mb-16">
        Customer statement records for
        <br />
        <Highlight>{filename}</Highlight>
        &nbsp;are all <Highlight>valid</Highlight>.
      </Description>
    </main>
  );
}
