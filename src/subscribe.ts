import { finished, pipeline, Readable, Transform } from "stream";

import { isReadable, isTransform } from "./is";
import { last } from "./utils";

/**
 * Pump streams and return the last value output from the pipeline
 */
export function subscribe<T = any>(source: Readable, ...targets: Transform[]) {
  return new Promise<T>((resolve, reject) => {
    if (!isReadable(source)) {
      throw new Error("The first argument must be a readable stream");
    }
    for (const target of targets) {
      if (!isTransform(target)) {
        throw new Error("The other arguments must be transform streams");
      }
    }

    // Last collected value
    let value: T | undefined;

    // Data listener
    const listener = (data: T) => (value = data);

    // Last stream in pipeline
    const emitter = last(targets) || source;

    // Final callback
    const callback = (err?: any) => {
      // Clean listener
      emitter.removeListener("data", listener);

      // Close promise
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    };

    // Collect the data from the stream
    emitter.addListener("data", listener);

    // Handle single stream or pipeline
    if (targets.length <= 0) {
      finished(source, callback);
    } else {
      pipeline.apply(null, [source, ...targets, callback]);
    }
  });
}
