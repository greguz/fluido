import { Readable, Writable } from "stream";

export type Callback = (err?: any) => any;

export type Stream = Readable | Writable;
