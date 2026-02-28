// lib/schemas/index.ts – centralt schema-register

import * as ssabOxelosund from "./ssab-oxelosund-5lag";

export type SchemaId = "ssab-oxelosund-5lag" | string;

export const SCHEMAS = {
  "ssab-oxelosund-5lag": {
    id: ssabOxelosund.SCHEMA_ID,
    version: ssabOxelosund.SCHEMA_VERSION,
    label: ssabOxelosund.SCHEMA_LABEL,
    ...ssabOxelosund,
  },
} as const;

export const DEFAULT_SCHEMA_ID: SchemaId = "ssab-oxelosund-5lag";

export function getSchema(schemaId: SchemaId = DEFAULT_SCHEMA_ID): (typeof SCHEMAS)["ssab-oxelosund-5lag"] {
  const key = schemaId as keyof typeof SCHEMAS;
  const schema = SCHEMAS[key];
  if (!schema) throw new Error(`Okänt schema: ${schemaId}`);
  return schema;
}

export { ssabOxelosund };
