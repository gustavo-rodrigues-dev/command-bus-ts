import { Dispatch } from '..';
import { Command } from '../../command';
import { Handle } from '../../handle';
import { Observer } from '../../observer';
import { Middleware, Next } from '../../middleware';
import { Context } from '../model/context';
import { MiddlewareStorm } from '../../middleware/service/middleware-storm';
import { DefaultPublisher } from '../../publisher/service/default-publisher';

/**
 * Class responsible to manage calls of commands and dispatch handlers and observables
 *
 * @export
 * @class CommandBus
 * @implements {Dispatch}
 */
export class CommandBus implements Dispatch {
  private readonly context: Map<string | Symbol, Context>;
  private readonly globalMiddlewares: Middleware<any>[];
  constructor(logger: Console = console) {
    this.context = new Map();
    this.globalMiddlewares = [];
  }

  /**
   * Method responssible to get a command context
   *
   * @private
   * @param {Command} command
   * @returns {Context}
   * @memberof CommandBus
   */
  private getCommand(command: Command): Context {
    const commandContext = this.context.get(command.commandName);
    if (!commandContext) {
      throw new Error('Context not found');
    }

    return commandContext;
  }

  /**
   * Class responsible to update context of command
   *
   * @private
   * @param {Context} context
   * @returns {this}
   * @memberof CommandBus
   */
  private updateContext(context: Context): this {
    if (!this.context.has(context.command.commandName)) {
      throw new Error('Context not found');
    }
    this.context.set(context.command.commandName, context);

    return this;
  }

  /**
   * Method reposnible to register some command and your handle
   *
   * @param {Command} command
   * @param {Handle} handle
   * @returns {this}
   * @memberof CommandBus
   */
  public registerCommand(command: Command, handle: Handle): this {
    if (!command.commandName) {
      throw new Error('Command dont have commandName');
    }
    this.context.set(command.commandName, {
      command,
      handle,
      middlewares: [],
      listners: new DefaultPublisher(),
    });

    return this;
  }

  /**
   * Method use is responsible to register a global middleware or a middleware into some command
   *
   * @param {Middleware<any>} middleware
   * @param {Command} [command]
   * @returns {this}
   * @memberof CommandBus
   * @example CommandBus.use(middleware)
   */
  public use(middleware: Middleware<any>, command?: Command): this {
    if (!command) {
      this.globalMiddlewares.push(middleware);

      return this;
    }
    const commandContext = this.getCommand(command);
    commandContext.middlewares.push(middleware);

    return this.updateContext(commandContext);
  }

  /**
   * Method subscribeCommand is responsible to register a Observable to a command
   *
   * @param {Command} command
   * @param {Observer} observer
   * @returns {this}
   * @memberof CommandBus
   */
  public subscribeCommand(command: Command, observer: Observer): this {
    const commandContext = this.getCommand(command);
    commandContext.listners.subscribe(observer);

    return this.updateContext(commandContext);
  }

  /**
   * Method unsubscribeCommand is responsible to unregister a Observable into a command
   *
   * @param {Command} command
   * @param {Observer} observer
   * @returns {this}
   * @memberof CommandBus
   */
  public unsubscribeCommand(command: Command, observer: Observer): this {
    const commandContext = this.getCommand(command);
    commandContext.listners.unsubscribe(observer);

    return this.updateContext(commandContext);
  }

  /**
   * Method execute is responsible to dipatch a Command to own handle, and rum all middlewares
   * before handle, dispatch message to all subscribers.
   *
   * @template T
   * @param {Command} command
   * @returns {Promise<T>}
   * @memberof CommandBus
   */
  public async execute<T>(command: Command): Promise<T> {
    const commandContext = this.getCommand(command);
    const middlewares = [
      ...this.globalMiddlewares,
      ...commandContext.middlewares,
    ];
    let result: any;
    middlewares.push(async (context, next: Next) => {
      result = (await context.handle.execute(context.command)) as T;

      try {
        commandContext.listners.notify({
          req: command,
          res: result,
          error: undefined,
        });
        // tslint:disable-next-line: no-empty
      } catch (error) {}
      next();
    });

    try {
      await MiddlewareStorm.invoke(commandContext, middlewares);
    } catch (error) {
      try {
        commandContext.listners.notify({ req: command, res: undefined, error });
        // tslint:disable-next-line: no-empty
      } catch (err) {}
      throw error;
    }

    return result;
  }
}
