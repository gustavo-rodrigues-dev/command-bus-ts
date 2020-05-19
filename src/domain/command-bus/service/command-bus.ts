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
 * @implements Dispatch
 * @since 1.0.0
 * @implements {Dispatch}
 * @example
 *  new CommandBus(console); //returns CommandBus {}
 * @example
 *  new CommandBus(); //returns CommandBus { }
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
   * @param {string | Symbol} commandName
   * @returns {Context}
   * @since 1.0.0
   * @memberof CommandBus
   * @example
   * const command = new CommandBus();
   * command.getCommand('ok');
   * // returns { command: { commandName: 'ok'},
   * commandName: 'ok',
   *  handle: { execute: [Function] },
   *  middlewares: [ [Function]],
   *  listners: DefaultPublisher { subscribers: Set { [Object] } },
   *  }
   * @example
   * const command = new CommandBus();
   * command.getCommand('not found'); // return Error('Context not found')
   */
  private getCommand(commandName: string | Symbol): Context {
    const commandContext = this.context.get(commandName);
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
   * @since 1.0.0
   * @memberof CommandBus
   * @example
   *  const command = new CommandBus();
   *  new command.updateContext({ command: { commandName: 'ok'},
   * commandName: 'ok',
   *  handle: { execute: [Function] },
   *  middlewares: [ [Function]],
   *  listners: DefaultPublisher { subscribers: Set { [Object] } },
   *  }); //returns CommandBus {}
   * @example
   * const command = new CommandBus();
   * command.updateContext('not found'); // return Error('Context not found')
   */
  private updateContext(context: Context): this {
    if (!this.context.has(context.commandName)) {
      throw new Error('Context not found');
    }
    this.context.set(context.commandName, context);

    return this;
  }

  /**
   * Method reposnible to register some command and your handle
   *
   * @param {string | Symbol} commandName
   * @param {Handle} handle
   * @returns {this}
   * @since 1.0.0
   * @memberof CommandBus
   * @example
   * const command = new CommandBus();
   * command.registerCommand('ok', { execute: (req) => {} });
   * //returns CommandBus {}
   * @example
   * const command = new CommandBus();
   * command.registerCommand(undefined, (req) => {});
   * //return Error('Command dont have commandName')
   */
  public registerCommand(commandName: Symbol | string, handle: Handle): this {
    if (!commandName) {
      throw new Error('Command dont have commandName');
    }
    this.context.set(commandName, {
      command: {
        commandName,
      },
      commandName,
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
   * @param {string | Symbol} commandName
   * @returns {this}
   * @memberof CommandBus
   * @since 1.0.0
   * @example
   * const command = new CommandBus();
   * command.use((req, next) => {}, 'command');
   * //returns CommandBus {}
   * @example
   * const command = new CommandBus();
   * command.use((req, next) => {});
   * //returns CommandBus {}
   */
  public use(middleware: Middleware<any>, commandName?: string | Symbol): this {
    if (!commandName) {
      this.globalMiddlewares.push(middleware);

      return this;
    }
    const commandContext = this.getCommand(commandName);
    commandContext.middlewares.push(middleware);

    return this.updateContext(commandContext);
  }

  /**
   * Method subscribeCommand is responsible to register a Observable to a command
   *
   * @param {string | Symbol} commandName
   * @param {Observer} observer
   * @returns {this}
   * @memberof CommandBus
   * @since 1.0.0
   * @example
   * const command = new CommandBus();
   * command.subscribeCommand('command', { update: (subject) => {}});
   * //returns CommandBus {}
   * @example
   * const command = new CommandBus();
   * command.use((req, next) => {});
   * command.subscribeCommand('not found', { update: (subject) => {}});
   * // return Error('Context not found')
   */
  public subscribeCommand(
    commandName: string | Symbol,
    observer: Observer
  ): this {
    const commandContext = this.getCommand(commandName);
    commandContext.listners.subscribe(observer);

    return this.updateContext(commandContext);
  }

  /**
   * Method unsubscribeCommand is responsible to unregister a Observable into a command
   *
   * @param {string | Symbol} commandName
   * @param {Observer} observer
   * @returns {this}
   * @memberof CommandBus
   * @since 1.0.0
   * @example
   * const command = new CommandBus();
   * command.unsubscribeCommand('command', { update: (subject) => {}});
   * //returns CommandBus {}
   * @example
   * const command = new CommandBus();
   * command.use((req, next) => {});
   * command.unsubscribeCommand('not found', { update: (subject) => {}});
   * // return Error('Context not found')
   */
  public unsubscribeCommand(
    commandName: string | Symbol,
    observer: Observer
  ): this {
    const commandContext = this.getCommand(commandName);
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
   * @since 1.0.0
   * @example
   * const command = new CommandBus();
   * command.register('xxx', { execute: (req) => { console.log(req.arg)}})
   * await command.execute({ commandName: 'xxx', arg: 1}) // 1;
   * //returns CommandBus {}
   * @example
   * const command = new CommandBus();
   * command.execute({ commandName: 'not found', arg: 1}, { execute: (req) => { console.log(req.arg)}});
   * // return Error('Context not found')
   */
  public async execute<T>(command: Command): Promise<T> {
    const commandContext = this.getCommand(command.commandName);
    let result: any;
    commandContext.command = command;
    const middlewares = [
      ...this.globalMiddlewares,
      ...commandContext.middlewares,
      async (context: any, next: Next) => {
        result = await context.handle.execute(context.command);

        try {
          commandContext.listners.notify({
            req: command,
            res: result,
            error: undefined,
          });
          // tslint:disable-next-line: no-empty
        } catch (error) {}
        next();
      },
    ];

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
