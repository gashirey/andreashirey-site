export { upsertContact } from "./upsert";
export { listContacts } from "./list";
export type {
  ContactRow,
  ContactTag,
  UpsertContactInput,
  UpsertContactResult,
} from "./types";
export { CONTACT_TAGS } from "./types";
export { splitName, normalizeTags } from "./normalize";
