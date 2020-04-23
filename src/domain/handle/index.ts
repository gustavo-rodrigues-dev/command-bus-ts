export interface Handle {
  execute<T>(...args: any): T;
}
