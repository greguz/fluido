/// <reference types="node" />

import stream from "stream";
import streamWeb from "stream/web";

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

export interface ReadableOptions<T = any> {
  autoDestroy?: boolean;
  emitClose?: boolean;
  encoding?: string;
  highWaterMark?: number;
  objectMode?: boolean;
  signal?: AbortSignal;
  /**
   * This optional function will be called in a tick after the stream constructor has returned, delaying any `_write()`, `_final()` and `_destroy()` calls until callback is called.
   * This is useful to initialize state or asynchronously initialize resources before the stream can be used.
   */
  construct?(this: Readable<T>, callback: Callback): Promise<void> | void;
  /**
   *
   */
  read?(this: Readable<T>, size: number): void;
  /**
   *
   */
  asyncRead?(
    this: Readable<T>,
    size: number,
    callback: Callback<T | null>
  ): Promise<T | null | undefined | void> | void;
  /**
   *
   */
  destroy?(
    this: Readable<T>,
    err: any,
    callback: Callback
  ): Promise<void> | void;
}

export declare class Readable<T = any> extends stream.Readable {
  static from<T>(
    iterable: Iterable<T> | AsyncIterable<T>,
    options?: ReadableOptions<T>
  ): stream.Readable;
  static fromWeb(
    stream: streamWeb.ReadableStream,
    options?: object
  ): stream.Readable;
  static isDisturbed(stream: any): boolean;
  static toWeb(stream: stream.Readable): streamWeb.ReadableStream;
  constructor(options?: ReadableOptions<T>);
  _asyncRead?(
    size: number,
    callback: Callback<T | null>
  ): Promise<T | null | undefined | void> | void;
}

export interface WritableOptions<T = any> {
  autoDestroy?: boolean;
  concurrency?: number;
  decodeStrings?: boolean;
  defaultEncoding?: string;
  emitClose?: boolean;
  highWaterMark?: number;
  objectMode?: boolean;
  signal?: AbortSignal;
  /**
   *
   */
  construct?(this: Writable<T>, callback: Callback): Promise<void> | void;
  /**
   *
   */
  write?(
    this: Writable<T>,
    chunk: T,
    encoding: string,
    callback: Callback
  ): Promise<void> | void;
  /**
   *
   */
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
  /**
   *
   */
  destroy?(
    this: Writable<T>,
    err: any,
    callback: Callback
  ): Promise<void> | void;
}

export interface WritableEntry<T = any> {
  chunk: T;
  encoding: string;
}

export declare class Writable<T = any> extends stream.Writable {
  static fromWeb<W>(
    stream: streamWeb.WritableStream,
    options?: WritableOptions
  ): stream.Writable;
  static toWeb(stream: stream.Writable): streamWeb.WritableStream;
  constructor(options?: WritableOptions<T>);
}

export declare interface DuplexOptions<T = any, U = any>
  extends ReadableOptions<U>,
    WritableOptions<T> {
  allowHalfOpen?: boolean;
  readable?: boolean;
  writable?: boolean;
  readableObjectMode?: boolean;
  writableObjectMode?: boolean;
  readableHighWaterMark?: number;
  writableHighWaterMark?: number;
  /**
   *
   */
  construct?(this: Duplex<T, U>, callback: Callback): Promise<void> | void;
  /**
   *
   */
  read?(this: Duplex<T, U>, size: number): void;
  /**
   *
   */
  asyncRead?(
    this: Duplex<T, U>,
    size: number,
    callback: Callback<U | null>
  ): Promise<U | null | undefined | void> | void;
  /**
   *
   */
  write?(
    this: Duplex<T, U>,
    chunk: T,
    encoding: string,
    callback: Callback
  ): Promise<void> | void;
  /**
   *
   */
  writev?(
    this: Duplex<T, U>,
    entries: Array<WritableEntry<T>>,
    callback: Callback
  ): Promise<void> | void;
  /**
   *
   */
  final?(this: Duplex<T, U>, callback: Callback): Promise<void> | void;
  /**
   *
   */
  destroy?(
    this: Duplex<T, U>,
    err: any,
    callback: Callback
  ): Promise<void> | void;
}

export declare class Duplex<T = any, U = any> extends stream.Duplex {
  // TODO: fix this
  // static fromWeb({}, options?: object): stream.Duplex;
  // static toWeb(stream: stream.Duplex): { readable: streamWeb.ReadableStream; writable: streamWeb.WritableStream; };
  constructor(options: DuplexOptions<T, U>);
}

export declare interface TransformOptions<T = any, U = any>
  extends DuplexOptions<T, U> {
  /**
   *
   */
  transform?(
    this: Transform<T, U>,
    chunk: T,
    encoding: string,
    callback: Callback<U>
  ): Promise<U | void> | void;
  /**
   *
   */
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
 * Returns `true` when the argument is an instance of a NodeJS stream.
 */
export declare function isNodeStream(
  value: any
): value is stream.Readable | stream.Writable;

/**
 * Returns `true` when the argument is an instance of a `Readable` stream.
 */
export declare function isReadableStream(value: any): value is stream.Readable;

/**
 * Returns `true` when the argument is an instance of a `Writable` stream.
 */
export declare function isWritableStream(value: any): value is stream.Writable;

/**
 * Returns `true` when the argument is an instance of a `Duplex` stream.
 * `Tranform` streams are also `Duplex`.
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
  | stream.Readable
  | Iterable<any>
  | AsyncIterable<any>;

/**
 * Streaming transform.
 * Those types can be cast as `Transform` streams.
 */
export declare type PipelineTransform =
  | stream.Duplex
  | PipelineTransformFunction;

/**
 * Streaming destination.
 * Those types can be cast as `Writable` streams.
 */
export declare type PipelineDestination<T = unknown> =
  | stream.Writable
  | PipelineDestinationFunction<T>;

/**
 * Map an async iterable into another async iterable.
 */
export declare type PipelineTransformFunction = (
  source: AsyncIterable<any>
) => AsyncIterable<any>;

/**
 * A function that consumes an async iterable.
 */
export declare type PipelineDestinationFunction<T = unknown> = (
  source: AsyncIterable<any>
) => Promise<T>;

export interface PipelineOptions {
  signal?: AbortSignal;
}

/**
 * A module method to pipe between streams and generators forwarding errors and properly cleaning up and provide a callback when the pipeline is complete.
 */
export declare function pipeline(
  source: PipelineSource,
  ...args: Array<
    PipelineTransform | PipelineDestination | PipelineCallback | PipelineOptions
  >
): void;
export declare function pipeline<T = unknown>(
  source: PipelineSource,
  ...args: Array<PipelineTransform | PipelineDestination<T> | PipelineOptions>
): Promise<T>;

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
