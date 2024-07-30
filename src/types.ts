export type IExtNameFn = (path: string) => string;

export interface IMimeTypes {
  types: Record<string, string>;
  extensions: Record<string, Array<string>>;
  typeSets: Record<string, Array<string>>;

  getCharset(str: string): boolean | string;
  getContentType(str: string): boolean | string;
  getExtension(type: string): boolean | string;
  getMime(type: string): boolean | string;
  getMimes(type: string): boolean | Array<string>;
}
