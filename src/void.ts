import { Readable, Transform, Writable } from "stream";

export function read(this: Readable) {
  this.push(null);
}

export function transform(
  this: Transform,
  chunk: any,
  encoding: string,
  callback: (err?: any, data?: any) => any
) {
  callback(null, chunk);
}

export function write(
  this: Writable,
  chunk: any,
  encoding: string,
  callback: (err?: any) => any
) {
  callback();
}
