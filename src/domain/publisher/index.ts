import { Observer } from '../observer';

/**
 * Interface of Publisher
 *
 * @export
 * @interface Publisher
 * @since 1.0.0
 */
export interface Publisher {
  readonly subscribers: Set<Observer>;
  /**
   * This method is responsible to register a subscriber
   *
   * @param {Observer} observer
   * @returns {this}
   * @memberof Publisher
   * @since 1.0.0
   */
  subscribe(observer: Observer): this;
  /**
   * This method unsibscribe Observable
   *
   * @param {Observer} observer
   * @returns {this}
   * @memberof Publisher
   * @since 1.0.0
   */
  unsubscribe(observer: Observer): this;
  /**
   * This method is responsible to publish message to all subscribers
   *
   * @param {*} message
   * @memberof Publisher
   * @since 1.0.0
   */
  notify(message: any): void;
}
