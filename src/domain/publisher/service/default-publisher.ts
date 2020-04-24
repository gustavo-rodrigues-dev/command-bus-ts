import { MultiError } from 'VError';
import { Observer } from '../../observer';

/**
 * Class are responsible to publish message to subscribers where you register
 * @export
 * @class DefaultPublisher
 */
export class DefaultPublisher {
  private readonly subscribers: Set<Observer>;
  constructor() {
    this.subscribers = new Set();
  }

  /**
   * This method is responsible to register a subscriber into DefaultPublisher
   *
   * @param {Observer} observer
   * @returns {this}
   * @memberof DefaultPublisher
   */
  public subscribe(observer: Observer): this {
    this.subscribers.add(observer);
    return this;
  }

  /**
   * This method unsibscribe Observable into Publish Bus
   *
   * @param {Observer} observer
   * @returns {this}
   * @memberof DefaultPublisher
   */
  public unsubscribe(observer: Observer): this {
    this.subscribers.delete(observer);
    return this;
  }


  /**
   *  This method is responsible to publish message to all subscribers
   *
   * @param {*} message
   * @memberof DefaultPublisher
   * @returns {void}
   */
  public notify(message: any): void {
    const errors = [];
    for (const subscriber of this.subscribers) {
      try {
        subscriber.update(message);
      } catch (error) {
        errors.push(error);
      }
    }

    if (errors.length) {
      throw new MultiError(errors);
    }
  }
}
