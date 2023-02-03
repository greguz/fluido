/// <reference types="node" />

import stream from "stream";

// Proxied (no mods) exports
export {
  PassThrough,
  Stream,
  // TODO: compose,
  isErrored,
  isReadable,
  addAbortSignal,
} from "stream";

/**
 * Common callback function with type for the result value.
 */
export declare type Callback<T = any> = (err?: any, result?: T) => void;

export interface ReadableOptions<T = any> extends stream.ReadableOptions {
  /**
   * This optional function will be called in a tick after the stream constructor has returned, delaying any `_write()`, `_final()` and `_destroy()` calls until callback is called.
   * This is useful to initialize state or asynchronously initialize resources before the stream can be used.
   */
  construct?(this: Readable<T>, callback: Callback): Promise<void> | void;
  read?(this: Readable<T>, size: number): void;
  asyncRead?(
    this: Readable<T>,
    size: number,
    callback: Callback<T | null>
  ): Promise<T | null | undefined | void> | void;
  destroy?(
    this: Readable<T>,
    err: any,
    callback: Callback
  ): Promise<void> | void;
}

export declare class Readable<T = any> extends stream.Readable {
  constructor(options?: ReadableOptions<T>);
  _asyncRead?(
    size: number,
    callback: Callback<T | null>
  ): Promise<T | null | undefined | void> | void;
}

export interface WritableOptions<T = any> extends stream.WritableOptions {
  construct?(this: Writable<T>, callback: Callback): Promise<void> | void;
  write?(
    this: Writable<T>,
    chunk: T,
    encoding: string,
    callback: Callback
  ): Promise<void> | void;
  writev?(
    this: Writable<T>,
    entries: Array<WritableEntry<T>>,
    callback: Callback
  ): Promise<void> | void;
  /**
   * This optional function will be called before the stream closes, delaying the `'finish'` event until callback is called.
   * This is useful to close resources or write buffered data before a stream ends.
   */
  final?(this: Writable<T>, callback: Callback): Promise<void> | void;
  destroy?(
    this: Writable<T>,
    err: any,
    callback: Callback
  ): Promise<void> | void;
}

export interface WritableEntry<T = any> {
  chunk: T;
  encoding: BufferEncoding;
}

export declare class Writable<T = any> extends stream.Writable {
  constructor(options?: WritableOptions<T>);
}

export declare interface DuplexOptions<T = any, U = any>
  extends stream.DuplexOptions,
    ReadableOptions<U>,
    WritableOptions<T> {
  construct?(this: Duplex<T, U>, callback: Callback): Promise<void> | void;
  read?(this: Duplex<T, U>, size: number): void;
  asyncRead?(
    this: Duplex<T, U>,
    size: number,
    callback: Callback<U | null>
  ): Promise<U | null | undefined | void> | void;
  write?(
    this: Duplex<T, U>,
    chunk: T,
    encoding: string,
    callback: Callback
  ): Promise<void> | void;
  writev?(
    this: Duplex<T, U>,
    entries: Array<WritableEntry<T>>,
    callback: Callback
  ): Promise<void> | void;
  final?(this: Duplex<T, U>, callback: Callback): Promise<void> | void;
  destroy?(
    this: Duplex<T, U>,
    err: any,
    callback: Callback
  ): Promise<void> | void;
}

export declare class Duplex<T = any, U = any> extends stream.Duplex {
  constructor(options: DuplexOptions<T, U>);
}

export declare interface TransformOptions<T = any, U = any>
  extends DuplexOptions<T, U> {
  transform?(
    this: Transform<T, U>,
    chunk: T,
    encoding: string,
    callback: Callback<U>
  ): Promise<U | void> | void;
  flush?(
    this: Transform<T, U>,
    callback: Callback<U>
  ): Promise<U | void> | void;
}

export declare class Transform<T = any, U = any> extends stream.Transform {
  constructor(options?: TransformOptions<T, U>);
}

export interface FinishedOptions {
  error?: boolean;
  readable?: boolean;
  writable?: boolean;
  signal?: AbortSignal;
}

/**
 * A function to get notified when a stream is no longer readable, writable or has experienced an error or a premature close event.
 */
export declare function finished(stream: stream.Stream): Promise<void>;
export declare function finished(
  stream: stream.Stream,
  options: FinishedOptions
): Promise<void>;
export declare function finished(
  stream: stream.Stream,
  callback: Callback
): () => void;
export declare function finished(
  stream: stream.Stream,
  options: FinishedOptions,
  callback: Callback
): () => void;

/**
 * Returns `true` when the argument is a NodeJS stream (Readable or Writable).
 */
export declare function isNodeStream(
  value: any
): value is stream.Readable | stream.Writable;

/**
 * Returns `true` when the argument is a NodeJS Readable stream.
 */
export declare function isReadableStream(value: any): value is stream.Readable;

/**
 * Returns `true` when the argument is a NodeJS Writable stream.
 */
export declare function isWritableStream(value: any): value is stream.Writable;

/**
 * Returns `true` when the argument is a NodeJS Duplex (both Readable and Writable) stream.
 */
export declare function isDuplexStream(value: any): value is stream.Duplex;

/**
 * Special callback needed to support universal signature (callback and Promise) for the `pipeline` function.
 */
export interface PipelineCallback<T = any> {
  (err?: any, result?: T): void;
  readonly callback: unique symbol;
}

/**
 * Cast a common callback function to a custom pipeline callback.
 */
export declare function asCallback<T>(
  callback: Callback<T>
): PipelineCallback<T>;

/**
 * Detects a customized callback function for the `pipeline` function.
 */
export declare function isCallback(value: any): value is PipelineCallback;

/**
 * Streaming source.
 * Those types can be cast as `Readable` streams.
 */
export declare type PipelineSource =
  | NodeJS.ReadableStream
  | Iterable<any>
  | AsyncIterable<any>
  | PipelineSourceFunction;

/**
 * Generates a stream-like source data.
 */
export type PipelineSourceFunction = () => Iterable<any> | AsyncIterable<any>;

/**
 * Streaming transform.
 * Those types can be cast as `Transform` streams.
 */
export declare type PipelineTransform =
  | NodeJS.ReadWriteStream
  | PipelineTransformFunction;

/**
 * Map an async iterable into another async iterable.
 */
export declare type PipelineTransformFunction = (
  source: PipelineSource | PipelineTransform
) => AsyncIterable<any>;

/**
 * Streaming destination.
 * Those types can be cast as `Writable` streams.
 */
export declare type PipelineDestination =
  | NodeJS.WritableStream
  | PipelineDestinationIterableFunction
  | PipelineDestinationPromiseFunction;

export declare type PipelineDestinationIterableFunction = (
  source: AsyncIterable<any>
) => AsyncIterable<any>;

export declare type PipelineDestinationPromiseFunction = (
  source: AsyncIterable<any>
) => Promise<any>;

/**
 * @deprecated Use `PipelineDestinationPromiseFunction`.
 */
export declare type PipelineDestinationFunction<T> =
  PipelineDestinationPromiseFunction;

export interface PipelineOptions {
  end?: any;
  signal?: AbortSignal;
}

/**
 * A module method to pipe between streams and generators forwarding errors and properly cleaning up and provide a callback when the pipeline is complete.
 */
export declare function pipeline(
  source: PipelineSource,
  ...args: Array<PipelineTransform | PipelineDestination | PipelineOptions>
): Promise<any>;
export declare function pipeline(
  source: PipelineSource,
  ...args: Array<PipelineTransform | PipelineDestination | PipelineCallback>
): stream.Writable;

/**
 * Merge zero, one, or more streams into a single `Duplex` stream.
 * You will read from all readable streams, and write to all writable streams.
 */
export declare function merge(
  ...streams: Array<stream.Readable | stream.Writable>
): stream.Duplex;

/**
 * Combines two or more streams into a `Duplex` stream that writes to the first stream and reads from the last.
 * Each provided stream is piped into the next, using `pipeline`.
 * If any of the streams error then all are destroyed, including the outer `Duplex` stream.
 */
export declare function compose(
  ...args: Array<PipelineSource | PipelineTransform | PipelineDestination>
): stream.Duplex;
