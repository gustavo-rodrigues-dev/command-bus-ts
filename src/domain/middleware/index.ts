export type Next = () => void | Promise<void>;

/**
 * A middleware
 */
export type Middleware<T> =
  (context: T, next: Next) => Promise<void> | void;
