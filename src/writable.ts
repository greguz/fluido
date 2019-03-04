import { Writable } from "stream";

import { Callback } from "./callback";

export interface WritableOptions {
  /**
   * Whether this stream should automatically call .destroy() on itself after ending. Default: false.
   * https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options
   */
  autoDestroy?: boolean;
  /**
   * Whether to encode strings passed to stream.write() to Buffers. Default: true.
   * https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options
   */
  decodeStrings?: boolean;
  /**
   * The default encoding that is used when no encoding is specified as an argument to stream.write(). Default: 'utf8'.
   * https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options
   */
  defaultEncoding?: string;
  /**
   * Whether or not the stream should emit 'close' after it has been destroyed. Default: true.
   * https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options
   */
  emitClose?: boolean;
  /**
   * Buffer level when stream.write() starts returning false. Default: 16384 (16kb), or 16 for objectMode streams.
   * https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options
   */
  highWaterMark?: number;
  /**
   * Whether or not the stream.write(anyObj) is a valid operation. Default: false.
   * https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options
   */
  objectMode?: boolean;
}

export interface WritableEntry<T> {
  chunk: T;
  encoding: string;
}

export interface WritableMethods<T> {
  /**
   * https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback_1
   */
  write?(this: Writable, chunk: T, encoding: string, callback: Callback): any;
  /**
   * https://nodejs.org/api/stream.html#stream_writable_writev_chunks_callback
   */
  writev?(
    this: Writable,
    entries: Array<WritableEntry<T>>,
    callback: Callback
  ): any;
  /**
   * https://nodejs.org/api/stream.html#stream_writable_final_callback
   */
  final?(this: Writable, callback: Callback): any;
  /**
   * https://nodejs.org/api/stream.html#stream_writable_destroy_err_callback
   */
  destroy?(this: Writable, err: any, callback: Callback): any;
}

export function writable<T = any>(
  options?: WritableOptions & WritableMethods<T>
) {
  return new Writable(options);
}
