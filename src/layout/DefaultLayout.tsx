import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { UploadButton } from '@/components/UploadButton';
import { LayoutContext } from '@/layout';
import { LoadingView } from '@/views/LoadingView';
import { processFile } from '@/fileProcessor';
import type { Report } from '@/domain/report';

export function DefaultLayout() {
  const [report, setReport] = useState<Report>();
  const [filename, setFilename] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onFileSelect(file: File) {
    setLoading(true);
    const { errorType, report } = await processFile(file);
    setFilename(file.name);
    setReport(report);
    navigate(`/${errorType}`);
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center md:min-h-screen">
      <form className="m-5 w-full max-w-md bg-gray-100 p-5 max-sm:mt-32">
        {loading && <LoadingView />}
        {!loading && (
          <LayoutContext.Provider value={{ filename, report }}>
            <Outlet />
          </LayoutContext.Provider>
        )}
        <UploadButton
          className="mt-6"
          disabled={loading}
          onFileSelect={onFileSelect}
          accept=".csv, .xml"
        />
      </form>
    </div>
  );
}
