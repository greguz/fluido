import { pipeline, Transform, Writable } from "stream";

import { isTransform, isWritable } from "./is";
import { Callback, first } from "./utils";
import { voidWritable } from "./void";
import { WritableOptions } from "./writable";

/**
 * Combine an array of streams into a single writable stream
 */
export function writify(
  streams: Array<Writable | Transform>,
  options?: WritableOptions
): Writable {
  // Validate streams
  for (let i = 0; i < streams.length; i++) {
    if (i === streams.length - 1) {
      if (!isWritable(streams[i])) {
        throw new TypeError("The last stream must be a writable stream");
      }
    } else {
      if (!isTransform(streams[i])) {
        throw new TypeError("Other streams must be transform streams");
      }
    }
  }

  // Handle simple cases
  if (streams.length <= 0) {
    return voidWritable(options);
  } else if (streams.length === 1) {
    return streams[0];
  }

  let target: Writable | undefined;

  let cbClose: Callback | undefined;

  let endReached = false;
  let endError: any;

  return new Writable({
    ...options,
    write(chunk, encoding, callback) {
      if (!target) {
        target = first(streams) as Writable;

        const done = (err?: any) => {
          target = undefined;

          endReached = true;
          endError = err;

          if (cbClose) {
            cbClose(err);
          }
        };

        pipeline.apply(null, [...streams, done]);
      }

      if (endReached) {
        callback(endError || new Error());
      } else {
        target.write(chunk, encoding, callback);
      }
    },
    final(callback) {
      if (endReached || !target) {
        callback(endError);
      } else {
        cbClose = callback;
        target.end();
      }
    },
    destroy(err: any, callback: Callback) {
      if (endReached || !target) {
        callback(err);
      } else {
        cbClose = callback;
        target.destroy(err);
      }
    }
  });
}
