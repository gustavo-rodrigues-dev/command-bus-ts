import { Command } from '../../command';
import { Handle } from '../../handle';
import { Middleware } from '../../middleware';
import { Observer } from '../../observer';
export interface Dispatch {
  execute<T>(command: Command): Promise<T>;
  registerCommand(command: Command, handle: Handle): this;
  use(middleware: Middleware<any>, command?: Command): this;
  subscribeCommand(command: Command, observer: Observer): this;
  unsubscribeCommand(command: Command, observer: Observer): this;
}
