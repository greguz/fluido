import { finished as _finished, Readable, Writable } from "stream";

import { Callback } from "./callback";
import { isClosed } from "./is";

function finished(stream: Readable | Writable): Promise<void>;
function finished(stream: Readable | Writable, callback: Callback): void;
function finished(stream: Readable | Writable, callback?: Callback) {
  if (callback === undefined) {
    return new Promise<void>((resolve, reject) =>
      finished(stream, err => (err ? reject(err) : resolve()))
    );
  }

  if (isClosed(stream)) {
    process.nextTick(callback);
  } else {
    finished(stream, callback);
  }
}

export { finished };
