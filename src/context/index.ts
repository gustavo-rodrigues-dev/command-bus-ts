export enum MiddlewareTypes {
  AFTER = 'AFTER',
  BEFORE = 'BEFORE',
}

export interface Middleware {
  type: MiddlewareTypes;
  call?<T>(propreties: any): T;
}

export interface CommandContext {
  namespace: string;
  handle?<T>(propreties: any): T;
}
