import { Observer } from '../observer';

/**
 * Interface of Publisher
 *
 * @export
 * @interface Publisher
 */
export interface Publisher {
  /**
   * This method is responsible to register a subscriber
   *
   * @param {Observer} observer
   * @returns {this}
   * @memberof Publisher
   */
  subscribe(observer: Observer): this;
  /**
   * This method unsibscribe Observable
   *
   * @param {Observer} observer
   * @returns {this}
   * @memberof Publisher
   */
  unsubscribe(observer: Observer): this;
  /**
   * This method is responsible to publish message to all subscribers
   *
   * @param {*} message
   * @memberof Publisher
   */
  notify(message: any): void;
}
