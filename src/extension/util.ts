import { Disposable, type Event, EventEmitter } from 'vscode';

export interface PromiseAdapter<T, U> {
  (
    value: T,
    resolve: (value: U | PromiseLike<U>) => void,
    reject: (reason: any) => void,
  ): any;
}

export const uuid = () => {
  const hexDigits = '0123456789abcdef';
  let uuid = '';

  for (let i = 0; i < 32; i++) {
    uuid += hexDigits.charAt(Math.floor(Math.random() * 16));
  }

  // Insert hyphens at the appropriate positions to match the UUID format
  uuid = `${uuid.substr(0, 8)}-${uuid.substr(8, 4)}-${uuid.substr(
    12,
    4,
  )}-${uuid.substr(16, 4)}-${uuid.substr(20)}`;

  return uuid;
};

const passthrough = (value: any, resolve: (value?: any) => void) =>
  resolve(value);

/**
 * Return a promise that resolves with the next emitted event, or with some future
 * event as decided by an adapter.
 *
 * If specified, the adapter is a function that will be called with
 * `(event, resolve, reject)`. It will be called once per event until it resolves or
 * rejects.
 *
 * The default adapter is the passthrough function `(value, resolve) => resolve(value)`.
 *
 * @param event the event
 * @param adapter controls resolution of the returned promise
 * @returns a promise that resolves or rejects as specified by the adapter
 */
export function promiseFromEvent<T, U>(
  event: Event<T>,
  adapter: PromiseAdapter<T, U> = passthrough,
): { promise: Promise<U>; cancel: EventEmitter<void> } {
  let subscription: Disposable;
  const cancel = new EventEmitter<void>();

  return {
    promise: new Promise<U>((resolve, reject) => {
      cancel.event(() => reject('Cancelled'));
      subscription = event((value: T) => {
        try {
          Promise.resolve(adapter(value, resolve, reject)).catch(reject);
        } catch (error) {
          reject(error);
        }
      });
    }).then(
      (result: U) => {
        subscription.dispose();
        return result;
      },
      (error) => {
        subscription.dispose();
        throw error;
      },
    ),
    cancel,
  };
}
