export interface Json {
  [x: string]: string | number | boolean | Json | JsonArray;
}

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface JsonArray extends Array<string | number | boolean | Json | JsonArray> {}
