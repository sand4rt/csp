type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[];
type JsonObject = { [Key in string]?: JsonValue };
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
