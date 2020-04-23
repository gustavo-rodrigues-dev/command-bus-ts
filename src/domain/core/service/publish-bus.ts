import { MultiError } from 'VError';
import { Observer } from '../../observer';

export class PublishBus {
  private readonly subscribers: Set<Observer>;
  constructor(){
    this.subscribers = new Set();
  }

  public subscribe(observer: Observer): this {
    this.subscribers.add(observer);
    return this;
  }

  public unsubscribe(observer: Observer): this {
    this.subscribers.delete(observer);
    return this;
  }

  public notify(message: any): void {
    const errors = [];
    for(const subscriber of this.subscribers) {
      try {
        subscriber.update(message);
      } catch (error) {
        errors.push(error);
      }
    }

    if(errors.length){
      throw new MultiError(errors);
    }
  }
}
