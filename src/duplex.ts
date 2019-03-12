import { Duplex } from "stream";

import { ReadableOptions, ReadableMethods } from "./readable";
import { read, write } from "./void";
import { WritableOptions, WritableMethods } from "./writable";

export type DuplexOptions = ReadableOptions & WritableOptions;

export type DuplexMethods<R, W> = ReadableMethods<R> & WritableMethods<W>;

/**
 * Creates a duplex stream
 */
export function duplex<R = any, W = any>(
  options?: DuplexOptions & DuplexMethods<R, W>
): Duplex {
  return new Duplex({ read, write, ...options });
}
