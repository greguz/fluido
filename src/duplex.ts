import { Duplex } from "stream";

import { ReadableOptions, ReadableMethods } from "./readable";
import { WritableOptions, WritableMethods } from "./writable";

export type DuplexOptions = ReadableOptions & WritableOptions;

export type DuplexMethods<T> = ReadableMethods<T> & WritableMethods<T>;

export function duplex<T = any>(options?: DuplexOptions & DuplexMethods<T>) {
  return new Duplex(options);
}
