import { Description } from '@/components/Description';
import { Loading } from '@/components/Loading';
import { LogoText } from '@/components/LogoText';

export function LoadingView() {
  return (
    <main className="max-w-md bg-gray-100 px-5">
      <LogoText />
      <Loading />
      <Description className="mb-16">
        The records are being validated.
        <br />
        One moment please...
      </Description>
    </main>
  );
}
