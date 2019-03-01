import { Readable, ReadableOptions } from "stream";

export function readable(options?: ReadableOptions) {
  return new Readable(options);
}
