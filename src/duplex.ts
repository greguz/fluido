import { Duplex, DuplexOptions } from "stream";

export function duplex(options?: DuplexOptions) {
  return new Duplex(options);
}
