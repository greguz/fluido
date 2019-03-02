import {
  pipeline,
  Readable,
  ReadableOptions,
  Transform,
  Writable
} from "stream";

import { Callback } from "./callback";

/**
 * Compose a stream pipeline into a single readable stream
 */
export function compose(streams: any[], options?: ReadableOptions): Readable {
  // Validate pipeline
  for (let i = 0; i < streams.length; i++) {
    const stream = streams[i];
    if (i === 0) {
      if (!(stream instanceof Readable)) {
        throw new Error("The first stream must be a readable");
      }
    } else {
      if (!(stream instanceof Transform)) {
        throw new Error("The other streams must be transforms");
      }
    }
  }

  // Handle special cases
  if (streams.length <= 0) {
    // Return an empty readable
    return new Readable({
      ...options,
      read() {
        this.push(null);
      }
    });
  } else if (streams.length === 1) {
    // A pipeline of a single stream, is the stream itself
    return streams[0] as Readable;
  }

  // Clone the streams array
  const line: any[] = [...streams];

  // Helpers
  let target: Writable | undefined;
  let next: Callback | undefined;
  let destroyed: Callback | undefined;

  // Return the composed readable stream
  return new Readable({
    ...options,
    read() {
      // This readable
      const readable = this;

      if (!target) {
        // Create a writable to append to the pipeline that writes to this readable
        target = new Writable({
          // Inherit the mode from the readable options
          objectMode: options && options.objectMode === true,
          // What is written to this stream, is pushed to the readable
          write(chunk: any, encoding: string, callback: Callback) {
            if (readable.push(chunk, encoding)) {
              // Everything is flowing, keep pushing
              callback();
            } else {
              // Backpressure kicks in, save the callback for the next "read"
              next = callback;
            }
          }
        });

        // Push our writable and the final callback
        line.push(target, (err?: any) => {
          // Flag the execution end
          target = undefined;

          if (destroyed) {
            // We are here because of a forced destruction
            destroyed(err);
          } else if (err) {
            // Errored finish, handle the error just like a normal readable
            readable.emit("error", err);
          } else {
            // No error, clean finish
            readable.push(null);
          }
        });

        // Run the pipeline
        pipeline.apply(null, line);
      } else if (next) {
        // Handle the backpressure mechanism
        const callback = next;
        next = undefined;
        callback();
      }
    },
    destroy(err: any, callback: Callback) {
      if (target) {
        // Save the destroy callback
        destroyed = callback;
        // Destroy our writable so the pipeline will stop
        target.destroy(err);
      } else {
        // Nothing is running (not sure why)
        callback(err);
      }
    }
  });
}
