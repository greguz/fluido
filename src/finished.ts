import { finished as _finished, Readable, Writable } from "stream";

import { Callback } from "./callback";
import { isClosed, isStream } from "./is";

function finished(stream: Readable | Writable): Promise<void>;
function finished(stream: Readable | Writable, callback: Callback): void;
function finished(stream: Readable | Writable, callback?: Callback) {
  if (callback === undefined) {
    return new Promise<void>((resolve, reject) =>
      finished(stream, err => (err ? reject(err) : resolve()))
    );
  }

  if (!isStream(stream)) {
    callback(new TypeError("Expected a stream"));
  } else if (isClosed(stream)) {
    process.nextTick(callback);
  } else {
    _finished(stream, callback);
  }
}

export { finished };
