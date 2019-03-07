import { pipeline } from "stream";

import { isReadable, isTransform } from "./is";

/**
 * Returns the last array element
 */
function last<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[arr.length - 1] : undefined;
}

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

  // Validate types
  for (let i = 0; i < args.length - 1; i++) {
    if (i === 0) {
      if (!isReadable(args[i])) {
        throw new Error("First argument must be a readable stream");
      }
    } else {
      if (!isTransform(args[i])) {
        throw new Error("The middle arguments must be transform streams");
      }
    }
  }

  // Pump the pipeline
  return pipeline.apply(null, args);
}
