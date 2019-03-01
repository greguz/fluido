import { Transform, TransformOptions } from "stream";

export function transform(options?: TransformOptions) {
  return new Transform(options);
}
