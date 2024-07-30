import MimeTypes from "./mime-types";
import MimeDb from "mime-db";
import instance from "./instance";

const {
  types,
  extensions,
  typeSets,

  getCharset,
  getContentType,
  getExtension,
  getMime,
  getMimes,
} = instance;
export {
  MimeTypes,
  MimeDb,
  types,
  extensions,
  typeSets,
  getCharset,
  getContentType,
  getExtension,
  getMime,
  getMimes,
};

export * from "./types";
export default instance;
