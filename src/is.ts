import { Duplex, Readable, Transform, Writable } from "stream";

export function isReadable(value: any): value is Readable {
  return value instanceof Readable;
}

export function isWritable(value: any): value is Writable {
  return value instanceof Writable;
}

export function isDuplex(value: any): value is Duplex {
  return value instanceof Duplex;
}

export function isTransform(value: any): value is Transform {
  return value instanceof Transform;
}

export function isStream(value: any): value is Readable | Writable {
  return isReadable(value) || isWritable(value);
}

export function isReadableStrictly(value: any): value is Readable {
  return isReadable(value) && !isWritable(value);
}

export function isWritableStrictly(value: any): value is Writable {
  return isWritable(value) && !isReadable(value);
}

export function isDuplexStrictly(value: any): value is Duplex {
  return isDuplex(value) && !isTransform(value);
}

export function isClosed(stream: Readable | Writable): boolean {
  if (!isStream(stream)) {
    throw new TypeError("Argument must be a stream instance");
  }

  const rc = isReadable(stream)
    ? (stream as any)._readableState.ended === true
    : true;

  const wc = isWritable(stream)
    ? (stream as any)._writableState.ended === true
    : true;

  return rc && wc;
}