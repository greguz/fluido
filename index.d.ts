/// <reference types="node" />

import { Readable, Writable, Duplex, Transform } from 'stream'

export declare type Readable = Readable
export declare type Writable = Writable
export declare type Duplex = Duplex
export declare type Transform = Transform

export declare type Stream = Readable | Writable
export declare type Callback<T = undefined> = (err?: any, data?: T) => any
export declare type VoidFunction = () => void

export declare type ReadableCallback<T> = (err?: any, data?: T | null) => any
export interface ReadableOptions {
  autoDestroy?: boolean
  encoding?: string
  highWaterMark?: number
  objectMode?: boolean
}
export interface ReadableMethods<T = any> {
  read?(
    this: Readable,
    size: number,
    callback: ReadableCallback<T>
  ): Promise<T | null | undefined | void> | unknown
  destroy?(this: Readable, err: any, callback: Callback): Promise<any> | unknown
}
export declare function readable<T = any>(
  options?: ReadableOptions & ReadableMethods<T>
): Readable

export interface WritableOptions {
  concurrency?: number
  autoDestroy?: boolean
  decodeStrings?: boolean
  defaultEncoding?: string
  emitClose?: boolean
  highWaterMark?: number
  objectMode?: boolean
}
export interface WritableEntry<T = any> {
  chunk: T
  encoding: string
}
export interface WritableMethods<T = any> {
  write?(
    this: Writable,
    chunk: T,
    encoding: string,
    callback: Callback
  ): Promise<any> | unknown
  writev?(
    this: Writable,
    entries: Array<WritableEntry<T>>,
    callback: Callback
  ): Promise<any> | unknown
  final?(this: Writable, callback: Callback): Promise<any> | unknown
  destroy?(this: Writable, err: any, callback: Callback): Promise<any> | unknown
}
export declare function writable<T = any>(
  options?: WritableOptions & WritableMethods<T>
): Writable

export declare type DuplexOptions = ReadableOptions & WritableOptions & {
  allowHalfOpen?: boolean
  readableObjectMode?: boolean
  writableObjectMode?: boolean
  readableHighWaterMark?: number
  writableHighWaterMark?: number
}
export declare type DuplexMethods<R = any, W = any> = ReadableMethods<R> &
  WritableMethods<W>
export declare function duplex<R = any, W = any>(
  options?: DuplexOptions & DuplexMethods<R, W>
): Duplex

export declare type TransformCallback<T = any> = (err?: any, data?: T) => any
export declare type TransformOptions = ReadableOptions & WritableOptions
export interface TransformMethods<R = any, W = any> {
  transform?(
    this: Transform,
    chunk: R,
    encoding: string,
    callback: TransformCallback<W>
  ): Promise<W | undefined | void> | unknown
  flush?(
    this: Transform,
    callback: TransformCallback<W>
  ): Promise<W | undefined | void> | unknown
  destroy?(
    this: Transform,
    err: any,
    callback: Callback
  ): Promise<any> | unknown
}
export declare function transform<R = any, W = any>(
  options?: TransformOptions & TransformMethods<R, W>
): Transform

export declare function collect(
  encoding?: string | false | undefined
): Transform

export interface EOSOptions {
  error?: boolean
  readable?: boolean
  writable?: boolean
}
export declare function eos(stream: Stream, callback: Callback): VoidFunction
export declare function eos(
  stream: Stream,
  options: EOSOptions,
  callback: Callback
): VoidFunction

export declare function finished(
  ...args: Array<Stream | [Stream, EOSOptions] | Callback>
): VoidFunction

export declare function handle(
  ...args: Array<Stream | [Stream, EOSOptions] | Callback>
): VoidFunction

export declare function pump(...args: Stream[]): Promise<void>
export declare function pump(...args: Array<Stream | Callback>): void

export declare function subscribe<T = any>(
  ...args: Array<Readable | Transform>
): Promise<T>
export declare function subscribe<T = any>(
  ...args: Array<Readable | Transform | Callback<T>>
): void

export declare function readify(
  streams: Array<Readable | Transform>,
  options?: ReadableOptions
): Readable

export declare function writify(
  streams: Array<Writable | Transform>,
  options?: WritableOptions
): Writable

export declare function duplexify(
  readable?: Readable | null | undefined,
  writable?: Writable | null | undefined,
  options?: DuplexOptions
): Duplex

export declare function mergeReadables(
  sources: Readable[],
  options?: ReadableOptions
): Readable

export declare function mergeWritables(
  targets: Writable[],
  options?: WritableMethods
): Writable

export declare function isReadable(value: any): value is Readable
export declare function isWritable(value: any): value is Writable
export declare function isStream(value: any): value is Stream
export declare function isDuplex(value: any): value is Duplex
export declare function isReadableStrictly(value: any): value is Readable
export declare function isWritableStrictly(value: any): value is Writable
