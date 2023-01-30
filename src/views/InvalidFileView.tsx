import { Highlight } from '@/components/Highlight';
import { Description } from '@/components/Description';
import { LogoText } from '@/components/LogoText';
import { ErrorIcon } from '@/components/ErrorIcon';
import { useLayout } from '@/layout';

export function InvalidFileView() {
  const { filename } = useLayout();
  return (
    <main className="max-w-md bg-gray-100 px-5">
      <LogoText />
      <ErrorIcon className="mx-auto mt-20" />
      <Description className="mb-20 mt-4">
        <Highlight>{filename}</Highlight> is an invalid file, please verify if
        the format is in <Highlight>MT940</Highlight>.
      </Description>
    </main>
  );
}
