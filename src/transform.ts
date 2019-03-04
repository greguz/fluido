import { Transform } from "stream";

import { Callback } from "./callback";

import { ReadableOptions } from "./readable";
import { WritableOptions } from "./writable";

export type TransformCallback<T> = (err?: any, data?: T) => any;

export interface TransformOptions extends ReadableOptions, WritableOptions {
  /**
   * Make the transform stream concurrent
   */
  concurrency?: number;
}

export interface TransformMethods<T> {
  /**
   * https://nodejs.org/api/stream.html#stream_transform_transform_chunk_encoding_callback
   */
  transform?(
    this: Transform,
    chunk: T,
    encoding: string,
    callback: TransformCallback<T>
  ): any;
  /**
   * https://nodejs.org/api/stream.html#stream_transform_flush_callback
   */
  flush?(this: Transform, callback: TransformCallback<T>): any;
  /**
   * https://nodejs.org/api/stream.html#stream_writable_destroy_err_callback
   */
  destroy?(this: Transform, err: any, callback: (err?: any) => any): any;
}

function concurrent(options: TransformOptions & TransformMethods<any>) {
  const concurrency = options.concurrency as number;

  if (
    typeof concurrency !== "number" ||
    isNaN(concurrency) ||
    concurrency <= 0
  ) {
    throw new TypeError("The concurrenct must be a positive number");
  }

  const _transform: any = options.transform;
  const _flush = options.flush;
  const _destroy = options.destroy;

  if (!_transform) {
    throw new Error("On concurrent mode the transform method is mandatory");
  }

  let jobs = 0;

  let erTransform: any;
  let cbTransform: Callback | undefined;
  let cbFlush: Callback | undefined;
  let cbDestroy: Callback | undefined;

  function transform(
    this: Transform,
    chunk: any,
    encoding: string,
    callback: Callback
  ) {
    if (!erTransform && !cbDestroy) {
      job.call(this, chunk, encoding);
    }

    if (jobs < concurrency && !erTransform && !cbDestroy) {
      callback();
    } else {
      cbTransform = callback;
    }
  }

  function job(this: Transform, chunk: any, encoding: string) {
    jobs++;

    _transform.call(this, chunk, encoding, (err?: any, data?: any) => {
      jobs--;

      // Save transform error (preserve first one)
      erTransform = erTransform || err;

      // Handle second argument
      if (data && !erTransform && !cbDestroy) {
        this.push(data);
      }

      if (jobs <= 0) {
        if (cbDestroy) {
          cbDestroy();
        } else if (cbFlush) {
          cbFlush(erTransform);
        } else if (erTransform && cbTransform) {
          cbTransform(erTransform);
        } else if (erTransform) {
          this.emit("error", erTransform);
        }
      } else if (cbTransform && !erTransform && !cbDestroy) {
        const callback = cbTransform;
        cbTransform = undefined;
        callback();
      }
    });
  }

  function flush(this: Transform, callback: Callback) {
    cbFlush = (err?: any) => {
      if (err || !_flush) {
        callback(err);
      } else {
        _flush.call(this, callback);
      }
    };

    if (jobs <= 0 && cbFlush) {
      cbFlush();
    }
  }

  function destroy(this: Transform, err: any, callback: Callback) {
    cbDestroy = _destroy ? _destroy.bind(this, err, callback) : callback;

    if (jobs <= 0 && cbDestroy) {
      cbDestroy();
    }
  }

  return new Transform({
    ...options,
    transform,
    flush,
    destroy
  });
}

/**
 * Create a transform stream
 */
export function transform<T = any>(
  options?: TransformOptions & TransformMethods<T>
) {
  if (options && options.concurrency !== undefined) {
    return concurrent(options);
  } else {
    return new Transform(options);
  }
}
