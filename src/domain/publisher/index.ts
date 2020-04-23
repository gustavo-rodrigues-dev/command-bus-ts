import { Observer } from '../observer';

export interface Publisher {
  subscribe(observer: Observer): this;
  unsubscribe(observer: Observer): this;
  notify(message: any): void;
}
