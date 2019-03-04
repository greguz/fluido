import { Readable, ReadableOptions } from "stream";

export interface ReadableOptions {
  /**
   * Whether this stream should automatically call .destroy() on itself after ending. Default: false.
   * https://nodejs.org/api/stream.html#stream_new_stream_readable_options
   */
  autoDestroy?: boolean;
  /**
   * If specified, then buffers will be decoded to strings using the specified encoding. Default: null.
   * https://nodejs.org/api/stream.html#stream_new_stream_readable_options
   */
  encoding?: string;
  /**
   * The maximum number of bytes to store in the internal buffer before ceasing to read from the underlying resource. Default: 16384 (16kb), or 16 for objectMode streams.
   * https://nodejs.org/api/stream.html#stream_new_stream_readable_options
   */
  highWaterMark?: number;
  /**
   * Whether this stream should behave as a stream of objects. Meaning that stream.read(n) returns a single value instead of a Buffer of size n. Default: false.
   * https://nodejs.org/api/stream.html#stream_new_stream_readable_options
   */
  objectMode?: boolean;
}

export interface ReadableMethods<T> {
  /**
   * https://nodejs.org/api/stream.html#stream_readable_read_size_1
   */
  read?(size: number): any;
  /**
   * https://nodejs.org/api/stream.html#stream_readable_destroy_err_callback
   */
  destroy?(err: any, callback: (err?: any) => any): any;
}

/**
 * Create a readable stream
 */
export function readable<T = any>(
  options?: ReadableOptions & ReadableMethods<T>
) {
  return new Readable(options);
}
