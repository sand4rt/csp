import { downloadAsCsv } from '@/fileProcessor';
import { Description } from '@/components/Description';
import { Highlight } from '@/components/Highlight';
import { LogoText } from '@/components/LogoText';
import { ErrorIcon } from '@/components/ErrorIcon';
import { useLayout } from '@/layout';

export function InvalidRecordsView() {
  const { filename, report } = useLayout();

  function onDownloadClick() {
    return downloadAsCsv(filename, report);
  }

  return (
    <main className="max-w-md bg-gray-100 px-5">
      <LogoText />
      <Description className="pt-4">
        <Highlight>{report.length}</Highlight> Invalid customer statement record
        <i>(s)</i> found in <Highlight>{filename}</Highlight>. For more more
        information,&nbsp;
        <button onClick={onDownloadClick} type="button">
          <Highlight className="text-secondary underline">
            download the full report
          </Highlight>
          .
        </button>
      </Description>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="pb-1 text-left">Reference</th>
            <th className="pb-1 text-right">Description</th>
          </tr>
        </thead>
        <tbody>
          {report.map((reportLine) => (
            <tr key={crypto.randomUUID()}>
              <td className="flex shrink-0 pb-4 text-left">
                <ErrorIcon className="float-left mr-3" width="24" height="24" />
                {reportLine?.reference || '-'}
              </td>
              <td className="pb-4 text-right">{reportLine.error}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
