import csvtojson from 'csvtojson';
import camelCase from 'camelcase';
import deepMapKeys from 'deep-map-keys';
import { XMLParser } from 'fast-xml-parser';
import { json2csv } from 'json-2-csv';
import type { JsonValue } from './jsonValue';

// fast-xml-parser lib requires a prefix for xml attributes
const ATTRIBUTE_NAME_PREFIX = '@_@_@_@_@';

function mapKeys(data: JsonValue): JsonValue {
  function removePrefix(key: string) {
    if (!key.startsWith(ATTRIBUTE_NAME_PREFIX)) return key;
    return key.slice(ATTRIBUTE_NAME_PREFIX.length);
  }
  return deepMapKeys(data, (key) => removePrefix(camelCase(key)));
}

export function xmlToJson(xml: string) {
  const json = new XMLParser({
    attributeNamePrefix: ATTRIBUTE_NAME_PREFIX,
    ignoreAttributes: false,
  }).parse(xml);
  return mapKeys(json);
}

export async function csvToJson(csv: string): Promise<JsonValue> {
  return csvtojson().fromString(csv).then(mapKeys);
}

export function jsonToCsv(json: JsonValue) {
  return new Promise<string>((resolve, reject) => {
    return json2csv(json as object[], (error, csv) => {
      if (error || !csv) return reject(error);
      return resolve(csv);
    });
  });
}
