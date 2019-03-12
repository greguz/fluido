import { Duplex, Readable, Transform, Writable } from "stream";

// Export just the types, not the constructors
export type Duplex = Duplex;
export type Readable = Readable;
export type Transform = Transform;
export type Writable = Writable;

export * from "./collect";
export * from "./duplex";
export * from "./duplexify";
export * from "./finished";
export * from "./is";
export * from "./pump";
export * from "./pumpify";
export * from "./readable";
export * from "./readify";
export * from "./subscribe";
export * from "./transform";
export { Callback, Stream } from "./utils";
export * from "./void";
export * from "./writable";
export * from "./writify";
