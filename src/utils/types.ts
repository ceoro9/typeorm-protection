export interface Json {
  [x: string]: string | number | boolean | Json | JsonArray;
}

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface JsonArray extends Array<string | number | boolean | Json | JsonArray> {}

export type MakePropertyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type Emptyable<T> = T | undefined | null;
