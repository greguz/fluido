/// <reference types="node" />

import * as stream from 'stream'

export { PassThrough, Stream } from 'stream'

export declare type Callback<T = any> = (err?: any, result?: T) => void
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
  ): Promise<T | null | undefined | void> | void
  destroy? (
    this: Readable<T>,
    err: any,
    callback: Callback
  ): Promise<any> | void
}
export declare class Readable<T = any> extends stream.Readable {
  static from<T> (iterable: Iterable<T> | AsyncIterable<T>): Readable<T>
  constructor (options?: ReadableOptions<T>)
  _asyncRead? (
    size: number,
    callback: Callback<T | null>
  ): Promise<T | null | undefined | void> | void
}

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
  ): Promise<any> | void
  writev? (
    this: Writable<T>,
    entries: Array<WritableItem<T>>,
    callback: Callback
  ): Promise<any> | void
  final? (
    this: Writable<T>,
    callback: Callback
  ): Promise<any> | void
  destroy? (
    this: Writable<T>,
    err: any,
    callback: Callback
  ): Promise<any> | void
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
  ): Promise<any> | void
}
export declare class Duplex<R = any, W = any> extends stream.Duplex {
  constructor (options: DuplexOptions<R, W>)
}

export declare interface TransformOptions<S = any, T = any> extends Omit<DuplexOptions<T, S>, 'destroy'> {
  transform? (
    this: Transform<S, T>,
    chunk: S,
    encoding: string,
    callback: Callback<T>
  ): Promise<T | undefined | void> | void
  flush? (
    this: Transform<S, T>,
    callback: Callback<T>
  ): Promise<T | undefined | void> | void
  destroy? (
    this: Transform<S, T>,
    err: any,
    callback: Callback
  ): Promise<any> | void
}
export declare class Transform<S = any, T = any> extends stream.Transform {
  constructor (options?: TransformOptions<S, T>)
}

export declare function collect (target?: 'buffer' | 'string' | 'array'): Transform

export declare function duplexify (
  readable?: stream.Readable | null,
  writable?: stream.Writable | null,
): Duplex
export declare function duplexify (
  options: Omit<DuplexOptions, Methods>,
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
): Promise<T | null>
export declare function subscribe<T = any> (
  head: stream.Readable,
  ...body: Array<stream.Duplex | Callback<T | null>>
): void

export declare function writify (
  ...streams: Array<stream.Writable | stream.Duplex>
): Writable
export declare function writify (
  options: Omit<WritableOptions, Methods>,
  ...streams: Array<stream.Writable | stream.Duplex>
): Writable

export declare function merge (
  ...streams: Array<stream.Readable | stream.Writable>
): stream.Duplex
export declare function merge (
  options: Omit<DuplexOptions, Methods>,
  ...streams: Array<stream.Readable | stream.Writable>
): stream.Duplex
