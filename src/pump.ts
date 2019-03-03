import { pipeline, Readable, Transform, Writable } from "stream";

/**
 * Pump streaming pipeline
 */
export function pump(source: Readable, ...targets: Writable[]) {
  return new Promise<void>((resolve, reject) => {
    if (!(source instanceof Readable)) {
      throw new Error("First argument must be a readable stream");
    }
    if (targets.length <= 0) {
      throw new Error("Missing target stream");
    }
    for (let i = 0; i < targets.length; i++) {
      if (i >= targets.length - 1) {
        if (!(targets[i] instanceof Writable)) {
          throw new Error("The last argument must be a writable stream");
        }
      } else {
        if (!(targets[i] instanceof Transform)) {
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
