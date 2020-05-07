/// <reference types="node" />

import * as stream from 'stream'

export declare type Callback<T = any> = (err?: any, data?: T) => void
export declare type Methods =
  | 'destroy'
  | 'read'
  | 'asyncRead'
  | 'write'
  | 'writev'
  | 'final'
  | 'transform'
  | 'flush'

export interface ReadableOptions<T = any> {
  autoDestroy?: boolean
  encoding?: string
  highWaterMark?: number
  objectMode?: boolean
  read? (
    this: Readable<T>,
    size: number
  ): void
  asyncRead? (
    this: Readable<T>,
    size: number,
    callback: Callback<T | null>
  ): Promise<T | null | void> | void
  destroy? (
    this: Readable<T>,
    err: any,
    callback: Callback
  ): Promise<void> | void
}
export declare class Readable<T = any> extends stream.Readable {
  static from<T> (iterable: T[] | Iterable<T> | AsyncIterable<T>): Readable<T>
  constructor (options?: ReadableOptions<T>)
  _asyncRead? (
    size: number,
    callback: Callback<T | null>
  ): Promise<T | null | void> | void
}
export declare function readArray<T> (
  iterable: T[] | Iterable<T> | AsyncIterable<T>
): Readable<T>

export interface WritableOptions<T = any> {
  autoDestroy?: boolean
  concurrency?: number
  decodeStrings?: boolean
  defaultEncoding?: string
  emitClose?: boolean
  highWaterMark?: number
  objectMode?: boolean
  write? (
    this: Writable<T>,
    chunk: T,
    encoding: string,
    callback: Callback
  ): Promise<void> | void
  writev? (
    this: Writable<T>,
    entries: Array<WritableItem<T>>,
    callback: Callback
  ): Promise<void> | void
  final? (
    this: Writable<T>,
    callback: Callback
  ): Promise<void> | void
  destroy? (
    this: Writable<T>,
    err: any,
    callback: Callback
  ): Promise<void> | void
}
export interface WritableItem<T = any> {
  chunk: T
  encoding: string
}
export declare class Writable<T = any> extends stream.Writable {
  constructor (options?: WritableOptions<T>)
}

export declare interface DuplexOptions<R = any, W = any> extends Omit<ReadableOptions<R>, 'destroy'>, Omit<WritableOptions<R>, 'destroy'> {
  allowHalfOpen?: boolean
  readableObjectMode?: boolean
  writableObjectMode?: boolean
  readableHighWaterMark?: number
  writableHighWaterMark?: number
  destroy? (
    this: Duplex<R, W>,
    err: any,
    callback: Callback
  ): Promise<void> | void
}
export declare class Duplex<R = any, W = any> extends stream.Duplex {
  constructor (options: DuplexOptions<R, W>)
}

export declare interface TransformOptions<R = any, W = any> extends Omit<DuplexOptions<R, W>, 'destroy'> {
  transform? (
    this: Transform<R, W>,
    chunk: W,
    encoding: string,
    callback: Callback<R>
  ): Promise<R | void> | void
  flush? (
    this: Transform<R, W>,
    callback: Callback<R>
  ): Promise<R | void> | void
  destroy? (
    this: Transform<R, W>,
    err: any,
    callback: Callback
  ): Promise<void> | void
}
export declare class Transform<R = any, W = any> extends stream.Transform {
  constructor (options?: TransformOptions<R, W>)
}

export declare function collect (encoding?: string | false): Transform

export declare function duplexify (
  readable?: stream.Readable | null,
  writable?: stream.Writable | null,
): Duplex

export interface FinishedOptions {
  error?: boolean
  readable?: boolean
  writable?: boolean
}
export declare function finished (
  stream: stream.Stream
): Promise<void>
export declare function finished (
  stream: stream.Stream,
  options: FinishedOptions
): Promise<void>
export declare function finished (
  stream: stream.Stream,
  callback: Callback
): () => void
export declare function finished (
  stream: stream.Stream,
  options: FinishedOptions,
  callback: Callback
): () => void
export declare function eos (
  stream: stream.Stream
): Promise<void>
export declare function eos (
  stream: stream.Stream,
  options: FinishedOptions
): Promise<void>
export declare function eos (
  stream: stream.Stream,
  callback: Callback
): () => void
export declare function eos (
  stream: stream.Stream,
  options: FinishedOptions,
  callback: Callback
): () => void

export declare function isReadable (value: any): value is stream.Readable
export declare function isWritable (value: any): value is stream.Writable
export declare function isStream (value: any): value is stream.Readable | stream.Writable
export declare function isDuplex (value: any): value is stream.Duplex
export declare function isReadableStrictly (value: any): value is stream.Readable
export declare function isWritableStrictly (value: any): value is stream.Writable

export declare function pipeline (
  head: stream.Readable,
  ...args: Array<stream.Duplex | stream.Writable>
): Promise<void>
export declare function pipeline (
  head: stream.Readable,
  ...args: Array<stream.Duplex | stream.Writable | Callback>
): void
export declare function pump (
  head: stream.Readable,
  ...args: Array<stream.Duplex | stream.Writable>
): Promise<void>
export declare function pump (
  head: stream.Readable,
  ...args: Array<stream.Duplex | stream.Writable | Callback>
): void

export declare function readify (
  head?: stream.Readable,
  ...body: stream.Transform[],
): Readable
export declare function readify (
  options: Omit<ReadableOptions, Methods>,
  head?: stream.Readable,
  ...body: stream.Transform[],
): Readable

export declare function subscribe<T = any> (
  head: stream.Readable,
  ...body: stream.Duplex[]
): Promise<T>
export declare function subscribe<T = any> (
  head: stream.Readable,
  ...body: Array<stream.Duplex | Callback<T>>
): void

export declare function writify (
  ...streams: Array<stream.Writable | stream.Duplex>
): Writable
export declare function writify (
  options: Omit<WritableOptions, Methods>,
  ...streams: Array<stream.Writable | stream.Duplex>
): Writable
