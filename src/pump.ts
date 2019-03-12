import { pipeline } from "stream";

import { isReadable, isTransform, isWritable } from "./is";
import { last } from "./utils";

/**
 * Returns true when the argument is a function
 */
function isFunction(value: any): value is (...args: any[]) => any {
  return typeof value === "function";
}

/**
 * Pump streaming pipeline
 */
export function pump(...args: any[]): any {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      pump(...args, (err?: any) => (err ? reject(err) : resolve()))
    );
  }

  // Ensure at least two streams to pipe
  if (args.length < 3) {
    throw new Error("Expected at least two streams to pipe");
  }

  // Extract streams from arguments
  const head = args[0];
  const body = args.slice(1, args.length - 2);
  const tail = args[args.length - 2];

  // Validate types
  if (!isReadable(head)) {
    throw new Error("First stream must be a readable stream");
  }
  for (const ts of body) {
    if (!isTransform(ts)) {
      throw new Error("Middle streams be transform streams");
    }
  }
  if (!isWritable(tail)) {
    throw new Error("Last stream must be a writable stream");
  }

  // Start data flow if the last stream is a transform instance
  if (isTransform(tail) && (tail as any).readableFlowing === null) {
    tail.resume();
  }

  // Pump the pipeline
  return pipeline.apply(null, args);
}
