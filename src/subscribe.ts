import { finished, pipeline, Readable, Transform } from "stream";

export function subscribe<T = any>(source: Readable, ...targets: Transform[]) {
  return new Promise<T>((resolve, reject) => {
    // Validate args
    if (!(source instanceof Readable)) {
      throw new Error("The first stream must be a readable");
    }
    for (let i = 0; i < targets.length; i++) {
      if (!(targets[i] instanceof Transform)) {
        throw new Error("The others stream must be transforms");
      }
    }

    // Last collected value
    let value: T | undefined;

    // Data listener
    const listener = (data: T) => (value = data);

    // Last stream in pipeline
    const target = targets.length <= 0 ? source : targets[targets.length - 1];

    // Final callback
    const callback = (err?: any) => {
      // Clean listener
      target.removeListener("data", listener);

      // Close promise
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    };

    // Collect the data from the stream
    target.addListener("data", listener);

    // Handle single stream or pipeline
    if (targets.length <= 0) {
      finished(source, callback);
    } else {
      pipeline.apply(null, [source, ...targets, callback]);
    }
  });
}