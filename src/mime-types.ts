import type { MimeDatabase, MimeEntry } from "mime-db";
import type { IExtNameFn, IMimeTypes } from "./types";
import { mimeScore, mimeExtensionScore } from "./scores";

class MimeTypes implements IMimeTypes {
  private db: MimeDatabase;
  private EXTRACT_TYPE_REGEXP: RegExp = /^\s*([^;\s]*)(?:;|\s|$)/;
  private TEXT_TYPE_REGEXP: RegExp = /^text\//i;
  private EXTRACT_EXT_REGEXP: RegExp = /^.+\.([^.]+)$/;
  types: Record<string, string> = Object.create(null);
  extensions: Record<string, Array<string>> = Object.create(null);
  typeSets: Record<string, Array<string>> = Object.create(null);

  constructor(db: MimeDatabase, extNameFn?: IExtNameFn) {
    this.db = db;
    if (extNameFn) {
      this.setExtNameFn(extNameFn);
    }

    this.populateMaps();
  }

  /**
   * Extract extension from file path/name
   * @private
   * @param {string} path path to file
   * @returns {string} string  extension or empty string if not found
   */
  private extname = (path: string): string => {
    const ext = this.EXTRACT_EXT_REGEXP.exec(path);
    return ext == null ? "" : `.${ext[1]}`;
  };

  /**
   * Set extname function for extracting extension from file path/name
   * @private
   * @param {Function} extname
   */
  private setExtNameFn(extname: IExtNameFn) {
    this.extname = extname;
  }

  /**
   * Obtain the extension of a filename or filepath.
   * If the path is not a string or a proper extension isn't found, false is returned.
   * The path is case insensitive (so hello.html and HELLO.HTML are equal).
   * @private
   * @param {string} path
   * @return {boolean|string} the file extension if available. false otherwise.
   */
  private extractExtension = (path: string): boolean | string => {
    if (!path || typeof path !== "string") {
      return false;
    }

    // get the extension ("ext" or ".ext" or full path)
    const extension = this.extname("x." + path)
      .toLowerCase()
      .substring(1);

    if (!extension) {
      return false;
    }

    return extension;
  };

  /**
   * Populate the extensions and types maps.
   * @private
   */
  private populateMaps = () => {
    const db: MimeDatabase = this.db;
    const types = this.types;
    const typeSets = this.typeSets;

    Object.keys(db).forEach((type) => {
      const mime: MimeEntry = db[type];
      const exts = mime.extensions;

      if (!exts || !exts.length) {
        return;
      }

      // mime -> extensions
      Object.assign(this.extensions, { [type]: exts });

      // extension -> mime
      for (let i = 0; i < exts.length; i++) {
        const extension = exts[i];
        if (typeSets[exts[i]]) {
          typeSets[exts[i]].push(type);
        } else {
          typeSets[exts[i]] = [type];
        }

        typeSets[exts[i]].sort(
          (a, b) => mimeScore(b, db[b].source) - mimeScore(a, db[a].source)
        );
        types[extension] = this._preferredType(types[extension], type);
      }
    });
  };

  // Resolve type conflict using mime-score
  _preferredType = (type0: string, type1: string) => {
    const score0 = type0 ? mimeScore(type0, this.db[type0].source) : 0;
    const score1 = type1 ? mimeScore(type1, this.db[type1].source) : 0;

    return score0 > score1 ? type0 : type1;
  };

  _extScore = (ext: string): number => {
    return mimeExtensionScore(
      this.types[ext],
      ext,
      this.db[this.types[ext]].source
    );
  };

  /**
   * Get the default charset for a MIME type.
   *
   * @param {string} type
   * @return {boolean|string}
   */

  getCharset = (type: string): boolean | string => {
    if (!type || typeof type !== "string") {
      return false;
    }

    // TODO: use media-typer
    const match = this.EXTRACT_TYPE_REGEXP.exec(type);
    const mime = match && this.db[match[1].toLowerCase()];

    if (mime && mime.charset) {
      return mime.charset;
    }

    // default text/* to utf-8
    if (match && this.TEXT_TYPE_REGEXP.test(match[1])) {
      return "UTF-8";
    }

    return false;
  };

  /**
   * Create a full Content-Type header given a MIME type or extension.
   *
   * @param {string} str - MIME type or file extension
   * @return {boolean|string}
   */
  getContentType = (str: string): boolean | string => {
    // TODO: should this even be in this module?
    if (!str || typeof str !== "string") {
      return false;
    }

    let mime = str.indexOf("/") === -1 ? this.getMime(str) : str;

    if (!mime) {
      return false;
    }

    // TODO: use content-type or other module
    if ((mime as string).indexOf("charset") === -1) {
      const charset = this.getCharset(mime as string);
      if (charset) mime += "; charset=" + (charset as string).toLowerCase();
    }

    return mime;
  };

  /**
   * Get the default extension for a MIME type.
   *
   * @param {string} type
   * @return {boolean|string}
   */
  getExtension = (type: string): boolean | string => {
    const exts = this.getExtensions(type);
    return exts.length ? exts[0] : false;
  };

  /**
   * Return all extensions for a given MIME type.
   * Supports wildcard types such as "image/*".
   *
   * @param mimeType The full mime string (e.g. "image/png" or "image/*")
   * @returns string[] Array of extensions (no leading dot). Empty array if none.
   */
  getExtensions = (mimeType: string | Array<string>): string[] => {
    const { types, extensions } = this;

    // If array input, merge all results (deduped)
    if (Array.isArray(mimeType)) {
      const set = new Set<string>();
      for (const mt of mimeType) {
        for (const ext of this.getExtensions(mt)) {
          set.add(ext);
        }
      }
      return Array.from(set).sort(
        (a, b) => this._extScore(b) - this._extScore(a)
      );
    }

    // Sanity check
    if (!mimeType || typeof mimeType !== "string") {
      return [];
    }

    let type = mimeType.trim().toLowerCase();
    type = type.split(";")[0].trim();

    const exact = extensions[type];
    if (Array.isArray(exact) && exact.length > 0) {
      return [...exact].sort((a, b) => this._extScore(b) - this._extScore(a));
    }

    if (!type.includes("*")) {
      return [];
    }

    const escapeRE = (s: string) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&"); // escape regex specials

    const pattern = "^" + escapeRE(type).replace(/\*/g, "[^\\/]*") + "$";
    const re = new RegExp(pattern);

    // Iterate 'types' map. In this repo 'types' maps ext -> mime (string or array)
    const results: string[] = [];
    for (const [ext, mimeValue] of Object.entries(types)) {
      if (!mimeValue) continue;

      if (re.test(mimeValue)) results.push(ext);
    }

    return Array.from(new Set(results)).sort(
      (a, b) => this._extScore(b) - this._extScore(a)
    );
  };

  /**
   * Lookup the MIME type for a file path/extension.
   *
   * @param {string} path
   * @return {boolean|string}
   */
  getMime = (path: string): boolean | string => {
    if (!path || typeof path !== "string") {
      return false;
    }

    // get the extension ("ext" or ".ext" or full path)
    const extension = this.extname("x." + path)
      .toLowerCase()
      .substring(1);

    if (!extension) {
      return false;
    }

    return this.types[extension] || false;
  };

  /**
   * Find all MIME types that are associated with a file extensions.
   *
   * @param {string} path or file extension
   * @return {boolean|array<string>}
   */
  getMimes = (path: string): boolean | Array<string> => {
    const extension = this.extractExtension(path);

    if (!extension) {
      return false;
    }

    return this.typeSets[extension as string] || false;
  };
}

export default MimeTypes;
