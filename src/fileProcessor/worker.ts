import type { FileType } from '@/domain/mt940File';
import { createReport } from '@/domain/report';
import { jsonToCsv, xmlToJson, csvToJson } from '@/fileProcessor/utils';
import type { JsonValue } from '@/fileProcessor/jsonValue';

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();

  const message = JSON.parse(event.data) as WorkerRequest;

  if (message.messageType === 'json-to-csv') {
    return jsonToCsv(message.json).then((csv) => {
      postMessage({ csv });
    });
  }

  if (message.messageType === 'xml-to-mt940') {
    const report = createReport({
      type: message.type,
      content: xmlToJson(message.content),
    });
    return postMessage(report);
  }

  if (message.messageType === 'csv-to-mt940') {
    return csvToJson(message.content).then((content) => {
      const report = createReport({ type: message.type, content });
      postMessage(report);
    });
  }
});

function postMessage(data: WorkerResponse) {
  self.postMessage(JSON.stringify(data));
}

type MessageType<T> = { messageType: T };
type CsvToJsonRequest = {
  type: FileType;
  content: string;
} & MessageType<'csv-to-mt940'>;
type XmlToJsonRequest = {
  type: FileType;
  content: string;
} & MessageType<'xml-to-mt940'>;
type JsonToCsvRequest = { json: JsonValue } & MessageType<'json-to-csv'>;

export type CsvToJsonResponse = ReturnType<typeof createReport>;
export type XmlToJsonResponse = ReturnType<typeof createReport>;
export type JsonToCsvResponse = { csv: string };

export type WorkerResponse =
  | CsvToJsonResponse
  | XmlToJsonResponse
  | JsonToCsvResponse;

export type WorkerRequest =
  | CsvToJsonRequest
  | XmlToJsonRequest
  | JsonToCsvRequest;
