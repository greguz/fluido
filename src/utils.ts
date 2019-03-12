import { Readable, Writable } from "stream";

export type Callback = (err?: any) => any;

export type Stream = Readable | Writable;

export function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

export function last<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[arr.length - 1] : undefined;
}
