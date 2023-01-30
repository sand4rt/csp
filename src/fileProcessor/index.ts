import type { FileType } from '@/domain/mt940File';
import { isXML } from '@/domain/mt940File';
import Worker from '@/fileProcessor/worker?worker';
import type { JsonValue } from '@/fileProcessor/jsonValue';
import type {
  CsvToJsonResponse,
  JsonToCsvResponse,
  WorkerRequest,
  WorkerResponse,
  XmlToJsonResponse,
} from '@/fileProcessor/worker';

export async function downloadAsCsv(filename: string, json: JsonValue) {
  const { csv } = await sendToWorker<JsonToCsvResponse>({
    messageType: 'json-to-csv',
    json,
  });

  const name = filename.split('.').slice(0, -1).join('.');
  const downloadUrl = encodeURI(`data:text/csv;charset=utf-8,${csv}`);
  const link = document.createElement('a');
  link.setAttribute('href', downloadUrl);
  link.setAttribute('target', '_blank');
  link.setAttribute('download', name);
  link.click();
  link.remove();
}

export async function processFile(file: File) {
  return sendToWorker<CsvToJsonResponse | XmlToJsonResponse>({
    messageType: isXML(file.type) ? 'xml-to-mt940' : 'csv-to-mt940',
    type: file.type as FileType,
    content: await takeContent(file),
  });
}

function sendToWorker<
  Response extends WorkerResponse,
  Request extends WorkerRequest = WorkerRequest
>(request: Request) {
  return new Promise<Response>((resolve, reject) => {
    const worker = new Worker();
    worker.postMessage(JSON.stringify(request));
    worker.onmessage = (event) => {
      resolve(JSON.parse(event.data));
    };
    worker.onerror = (error) => reject(error);
  });
}

function takeContent(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const decoder = new TextDecoder('utf-8');
      if (reader.result instanceof ArrayBuffer) {
        resolve(decoder.decode(reader.result));
      } else if (typeof reader.result === 'string') {
        resolve(reader.result);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
