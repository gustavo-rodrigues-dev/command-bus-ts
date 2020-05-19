/**
 * Interface of Handlers
 *
 * @export
 * @interface Handle
 */
export interface Handle {
  /**
   * This method are responsible to execute a handle of some command
   *
   * @template T
   * @param {...any} args
   * @returns {T}
   * @memberof Handle
   * @since 1.0.0
   */
  execute<T>(...args: any): T;
}
