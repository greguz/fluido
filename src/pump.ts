import { pipeline, Readable, Writable } from "stream";

import { isReadable, isTransform, isWritable } from "./is";

/**
 * Pump streaming pipeline
 */
export function pump(source: Readable, ...targets: Writable[]) {
  return new Promise<void>((resolve, reject) => {
    if (!isReadable(source)) {
      throw new Error("First argument must be a readable stream");
    }
    if (targets.length <= 0) {
      throw new Error("Missing target stream");
    }
    for (let i = 0; i < targets.length; i++) {
      if (i >= targets.length - 1) {
        if (!isWritable(targets[i])) {
          throw new Error("The last argument must be a writable stream");
        }
      } else {
        if (!isTransform(targets[i])) {
          throw new Error("The middle arguments must be transform streams");
        }
      }
    }
    pipeline.apply(null, [
      source,
      ...targets,
      (err?: any) => (err ? reject(err) : resolve())
    ]);
  });
}
