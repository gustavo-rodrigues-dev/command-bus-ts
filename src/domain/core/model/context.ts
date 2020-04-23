import { Handle } from '../../handle';
import { Command } from '../../command';
import { Middleware } from '../../middleware';
import { Publisher } from '../../publisher';

export interface Context {
  command: Command;
  handle: Handle;
  middlewares: Middleware<any>[];
  listners: Publisher;
}
