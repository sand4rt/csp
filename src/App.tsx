import { Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout/DefaultLayout';
import { InitialView } from '@/views/InitialView';
import { InvalidFileView } from '@/views/InvalidFileView';
import { InvalidRecordsView } from '@/views/InvalidRecordsView';
import { ValidView } from '@/views/ValidView';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<InitialView />} />
        <Route path="valid" element={<ValidView />} />
        <Route path="invalid-file" element={<InvalidFileView />} />
        <Route path="invalid-records" element={<InvalidRecordsView />} />
        <Route path="*" element={<InitialView />} />
      </Route>
    </Routes>
  );
}
