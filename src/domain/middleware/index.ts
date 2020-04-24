export type Next = () => void | Promise<void>;

/**
 * Interface of Middleware
 *
 * @export
 * @interface Middleware
 * @template T
 */
export interface Middleware <T>{
  (context: T, next: Next): Promise<void> | void;
}
