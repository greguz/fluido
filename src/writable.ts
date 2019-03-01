import { Writable, WritableOptions } from "stream";

export function writable(options?: WritableOptions) {
  return new Writable(options);
}
