export interface Observer {
  update<T>(subject: T): void;
}
