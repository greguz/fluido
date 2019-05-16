/// <reference types="node" />

import { Readable, Writable, Duplex, Transform } from 'stream'

export declare type Readable = Readable
export declare type Writable = Writable
export declare type Duplex = Duplex
export declare type Transform = Transform

export declare type Callback = (err?: any) => any

export interface ReadableOptions {
  autoDestroy?: boolean
  encoding?: string
  highWaterMark?: number
  objectMode?: boolean
}
export interface ReadableMethods<T = any> {
  read?(size: number): any
  destroy?(err: any, callback: Callback): any
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
  write?(this: Writable, chunk: T, encoding: string, callback: Callback): any
  writev?(
    this: Writable,
    entries: Array<WritableEntry<T>>,
    callback: Callback
  ): any
  final?(this: Writable, callback: Callback): any
  destroy?(this: Writable, err: any, callback: Callback): any
}
export declare function writable<T = any>(
  options?: WritableOptions & WritableMethods<T>
): Writable

export declare type Stream = Readable | Writable

export declare type DuplexOptions = ReadableOptions & WritableOptions
export declare type DuplexMethods<R = any, W = any> = ReadableMethods<R> &
  WritableMethods<W>
export declare function duplex<R = any, W = any>(
  options?: DuplexOptions & DuplexMethods<R, W>
): Duplex

export declare type TransformCallback<T = any> = (err?: any, data?: T) => any
export type TransformOptions = ReadableOptions & WritableOptions
export interface TransformMethods<R = any, W = any> {
  transform?(
    this: Transform,
    chunk: R,
    encoding: string,
    callback: TransformCallback<W>
  ): any
  flush?(this: Transform, callback: TransformCallback<W>): any
  destroy?(this: Transform, err: any, callback: (err?: any) => any): any
}
export declare function transform<R = any, W = any>(
  options?: TransformOptions & TransformMethods<R, W>
): Transform

export declare function collect(
  encoding?: string | false | undefined
): Transform

export declare function finished(...args: Stream[]): Promise<void>
export declare function finished(...args: Array<Stream | Callback>): void

export declare function handle(...args: Stream[]): Promise<void>
export declare function handle(...args: Array<Stream | Callback>): void

export declare function subscribe(
  ...args: Array<Readable | Transform>
): Promise<any>
export declare function subscribe(
  ...args: Array<Readable | Transform | Callback>
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
  readable: Readable,
  writable: Writable,
  options?: DuplexOptions
): Duplex

export declare function isReadable(value: any): value is Readable
export declare function isWritable(value: any): value is Writable
export declare function isDuplex(value: any): value is Duplex
export declare function isTransform(value: any): value is Transform
export declare function isStream(value: any): value is Stream
export declare function isReadableStrictly(value: any): value is Readable
export declare function isWritableStrictly(value: any): value is Writable
export declare function isDuplexStrictly(value: any): value is Duplex

export declare function pump(...args: Stream[]): Promise<any>
export declare function pump(...args: Array<Stream | Callback>): void

export declare function mergeReadables(
  sources: Readable[],
  options?: ReadableOptions
): Readable
