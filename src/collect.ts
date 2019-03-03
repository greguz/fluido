import { Transform } from "stream";

function toString(chunks: any[], encoding: string) {
  const decoder = new TextDecoder(encoding);
  let result = "";
  for (const chunk of chunks) {
    if (Buffer.isBuffer(chunk)) {
      result += chunk.toString(encoding);
    } else if (chunk instanceof Uint8Array) {
      result += decoder.decode(chunk);
    } else {
      throw new Error("Invalid chunk");
    }
  }
  return result;
}

function toBuffer(chunks: any[]) {
  let result = Buffer.from([]);
  for (const chunk of chunks) {
    if (Buffer.isBuffer(chunk) || chunk instanceof Uint8Array) {
      result = Buffer.concat([result, chunk]);
    } else {
      throw new Error("Invalid chunk");
    }
  }
  return result;
}

export function collect(encoding?: string | false | undefined) {
  let chunks: any[] = [];

  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      // Cast any string to buffer and save
      chunks.push(
        typeof chunk === "string" ? Buffer.from(chunk, encoding) : chunk
      );
      callback();
    },
    flush(callback) {
      // Guess default encoding
      if (encoding === undefined) {
        if (Buffer.isBuffer(chunks[0])) {
          encoding = "buffer";
        } else {
          encoding = false;
        }
      }

      // Get resulting data
      let err: any;
      let data: any;
      try {
        if (encoding === "buffer") {
          data = toBuffer(chunks);
        } else if (typeof encoding === "string") {
          data = toString(chunks, encoding);
        } else {
          data = chunks;
        }
      } catch (e) {
        err = e;
      }

      // Free resources
      chunks = [];

      // Close the stream
      callback(err, data);
    },
    destroy(err, callback) {
      // Just clean the chunks array
      chunks = [];
      callback(err);
    }
  });
}
