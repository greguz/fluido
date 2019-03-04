import { Duplex, Readable, Transform, Writable } from "stream";

import { Callback } from "./callback";

import { DuplexOptions } from "./duplex";

function voidReadable(): Readable {
  return new Readable({
    read() {
      this.push(null);
    }
  });
}

function voidWritable(): Writable {
  return new Writable({
    write(chunk, encoding, callback) {
      callback();
    },
    writev(entries, callback) {
      callback();
    }
  });
}

/**
 * Turn a writable and readable stream into a single duplex stream
 */
export function duplexify(
  readable?: Readable | null,
  writable?: Writable | null,
  options?: DuplexOptions
): Duplex {
  const rs = readable || voidReadable();
  if (
    !(rs instanceof Readable) ||
    rs instanceof Duplex ||
    rs instanceof Transform
  ) {
    throw new TypeError();
  }

  const ws = writable || voidWritable();
  if (
    !(ws instanceof Writable) ||
    ws instanceof Duplex ||
    ws instanceof Transform
  ) {
    throw new TypeError();
  }

  let listener: any;

  return new Duplex({
    ...options,
    writev: undefined,
    read() {
      if (listener) {
        listener = (data: any) => {
          if (!this.push(data)) {
            rs.pause();
          }
        };
        rs.addListener("data", listener);
      } else {
        rs.resume();
      }
    },
    write(chunk, encoding, callback) {
      ws.write(chunk, encoding, callback);
    },
    final(callback) {
      ws.end(callback);
    },
    destroy(err: any, callback: Callback) {
      if (listener) {
        rs.removeListener("data", listener);
      }
      rs.destroy(err);
      ws.destroy(err);
      callback(err);
    }
  });
}
