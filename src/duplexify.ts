import { finished, Duplex, Readable, Transform, Writable } from "stream";

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

  let clean: VoidFunction | undefined;

  return new Duplex({
    ...options,
    writev: undefined,
    read() {
      if (!clean) {
        const dataListener = (data: any) => {
          if (!this.push(data)) {
            rs.pause();
          }
        };

        rs.addListener("data", dataListener);

        const unsubscribe = finished(rs, err => {
          if (err) {
            this.emit("error", err);
          } else {
            this.push(null);
          }
        });

        clean = () => {
          rs.removeListener("data", dataListener);
          unsubscribe();
        };
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
      if (clean) {
        clean();
      }
      rs.destroy(err);
      ws.destroy(err);
      callback(err);
    }
  });
}
