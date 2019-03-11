import { Duplex } from "stream";

import { ReadableOptions, ReadableMethods } from "./readable";
import { WritableOptions, WritableMethods } from "./writable";

export type DuplexOptions = ReadableOptions & WritableOptions;

export type DuplexMethods<R, W> = ReadableMethods<R> & WritableMethods<W>;

export function duplex<R = any, W = any>(
  options?: DuplexOptions & DuplexMethods<R, W>
) {
  return new Duplex(options);
}
