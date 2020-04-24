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
  command: Command;
  handle: Handle;
  middlewares: Middleware<any>[];
  listners: Publisher;
}
