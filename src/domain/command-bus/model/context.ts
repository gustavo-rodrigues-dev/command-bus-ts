import { Handle } from '../../handle';
import { Command } from '../../command';
import { Middleware } from '../../middleware';
import { Publisher } from '../../publisher';

/**
 * Context of Command Dispatcher
 *
 * @export
 * @interface Context
 */
export interface Context {
  commandName: string | Symbol;
  handle: Handle;
  command?: Command;
  middlewares: Middleware<any>[];
  listners: Publisher;
}
