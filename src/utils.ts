export type Dictionary<T> = { [k: string]: T };

export type MaybePromise<T> = PromiseLike<T> | T;

export function assertType<T>(x: T) {}

export function returns<T>(): T { return undefined as any; }

export function castPromise<T>(promise: MaybePromise<T>): Promise<T> {
  return Promise.resolve(promise);
}
