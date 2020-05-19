export type Next = () => void | Promise<void>;

/**
 * Interface of Middleware
 *
 * @export
 * @interface Middleware
 * @since 1.0.0
 * @template T
 */
export interface Middleware<T> {
  (context: T, next: Next): Promise<void> | void;
}
