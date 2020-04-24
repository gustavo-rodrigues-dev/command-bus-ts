/**
 * Interface of Observe/Listner
 *
 * @export
 * @interface Observer
 */
export interface Observer {
  /**
   * This method is responsible to recive message of some subscription
   *
   * @template T
   * @param {T} subject
   * @memberof Observer
   */
  update<T>(subject: T): void;
}
