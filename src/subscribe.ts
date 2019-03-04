import { finished, pipeline, Readable, Transform } from "stream";

/**
 * Pump streams and return the last value output from the pipeline
 */
export function subscribe<T = any>(source: Readable, ...targets: Transform[]) {
  return new Promise<T>((resolve, reject) => {
    // Validate args
    if (!(source instanceof Readable)) {
      throw new Error("The first argument must be a readable stream");
    }
    for (const target of targets) {
      if (!(target instanceof Transform)) {
        throw new Error("The other arguments must be transform streams");
      }
    }

    // Last collected value
    let value: T | undefined;

    // Data listener
    const listener = (data: T) => (value = data);

    // Last stream in pipeline
    const last = targets.length <= 0 ? source : targets[targets.length - 1];

    // Final callback
    const callback = (err?: any) => {
      // Clean listener
      last.removeListener("data", listener);

      // Close promise
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    };

    // Collect the data from the stream
    last.addListener("data", listener);

    // Handle single stream or pipeline
    if (targets.length <= 0) {
      finished(source, callback);
    } else {
      pipeline.apply(null, [source, ...targets, callback]);
    }
  });
}
