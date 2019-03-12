import { isReadableStrictly, isWritableStrictly } from "./is";
import { ReadableOptions } from "./readable";
import { readify } from "./readify";
import { Stream, first, last } from "./utils";
import { WritableOptions } from "./writable";
import { writify } from "./writify";

/**
 * Combine an array of streams into a single stream
 */
export function pumpify(
  streams: Stream[],
  options?: ReadableOptions | WritableOptions
): Stream {
  if (streams.length <= 0) {
    throw new Error("Expected at least one stream");
  } else if (streams.length === 1) {
    return streams[0];
  }

  const asReadable = isReadableStrictly(first(streams));
  const asWritable = isWritableStrictly(last(streams));

  if (asReadable === asWritable) {
    throw new Error("Unable to guess the resulting stream");
  }

  return asReadable
    ? readify(streams as any[], options)
    : writify(streams as any[], options);
}
