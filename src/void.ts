import { Duplex, PassThrough, Transform, Writable } from "stream";

import { DuplexOptions } from "./duplex";
import { TransformOptions } from "./transform";
import { WritableOptions } from "./writable";

/**
 * Returns a void duplex stream
 */
export function voidDuplex(options?: DuplexOptions): Duplex {
  return new Duplex({
    ...options,
    read() {
      this.push(null);
    },
    write(chunk, encoding, callback) {
      callback();
    }
  });
}

/**
 * Returns a pass-through transform stream
 */
export function voidTransform(options?: TransformOptions): Transform {
  return new PassThrough(options);
}

/**
 * Returns a void writable stream
 */
export function voidWritable(options?: WritableOptions): Writable {
  return new Writable({
    ...options,
    write(chunk, encoding, callback) {
      callback();
    }
  });
}
