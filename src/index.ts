import { Duplex, Readable, Transform, Writable } from "stream";

// Export just the types, not the constructors
export type Duplex = Duplex;
export type Readable = Readable;
export type Transform = Transform;
export type Writable = Writable;

export * from "./callback";
export * from "./collect";
export * from "./duplex";
export * from "./duplexify";
export * from "./is";
export * from "./pump";
export * from "./pumpify";
export * from "./readable";
export * from "./subscribe";
export * from "./transform";
export * from "./writable";
