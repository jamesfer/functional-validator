export function assertType<T>(x: T) {}
export function returns<T>(): T { return undefined as any; }
export type Dictionary<T> = { [k: string]: T }
