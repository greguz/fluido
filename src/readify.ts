import { pipeline, Readable, Transform } from "stream";

import { isReadable, isTransform } from "./is";
import { readable, ReadableOptions } from "./readable";
import { Callback, last } from "./utils";

/**
 * Combine an array of streams into a single readable stream
 */
export function readify(
  streams: Array<Readable | Transform>,
  options?: ReadableOptions
): Readable {
  // Validate streams
  for (let i = 0; i < streams.length; i++) {
    if (i === 0) {
      if (!isReadable(streams[i])) {
        throw new TypeError("First stream must be a readable stream");
      }
    } else {
      if (!isTransform(streams[i])) {
        throw new TypeError("Other streams must be transform streams");
      }
    }
  }

  // Handle simple cases
  if (streams.length <= 0) {
    return readable(options);
  } else if (streams.length === 1) {
    return streams[0];
  }

  let source: Readable | undefined;
  let cbDestroy: Callback | undefined;

  return readable({
    ...options,
    read() {
      if (!source) {
        source = last(streams) as Readable;

        source.on("data", (chunk: any) => {
          if (!this.push(chunk)) {
            (source as Readable).pause();
          }
        });

        const callback = (err?: any) => {
          source = undefined;

          if (cbDestroy) {
            cbDestroy(err);
          } else if (err) {
            this.emit("error", err);
          } else {
            this.push(null);
          }
        };

        pipeline.apply(null, [...streams, callback]);
      } else {
        source.resume();
      }
    },
    destroy(err: any, callback: Callback) {
      if (!source) {
        callback(err);
      } else {
        cbDestroy = callback;
        source.destroy(err);
      }
    }
  });
}
