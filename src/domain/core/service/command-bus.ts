import { Dispatch } from '../dispatch';
import { Command } from '../../command';
import { Handle } from '../../handle';
import { Observer } from '../../observer';
import { Middleware } from '../../middleware';
import { Context } from '../model/context';
import { MiddlewareBus } from './middleware-bus';
import { PublishBus } from './publish-bus';

export class CommandBus implements Dispatch {
  private readonly context: Map<string | Symbol, Context>;
  private readonly globalMiddlewares: Middleware<any>[];
  constructor() {
    this.context = new Map();
    this.globalMiddlewares = [];
  }

  private getCommand(command: Command): Context {
    const commandContext = this.context.get(command.commandName);
    if (!commandContext) {
      throw new Error('Context not found');
    }

    return commandContext;
  }

  private updateContext(context: Context): this {
    if (!this.context.has(context.command.commandName)) {
      throw new Error('Context not found');
    }
    this.context.set(context.command.commandName, context);

    return this;
  }

  public registerCommand(command: Command, handle: Handle): this {
    this.context.set(command.commandName, {
      command,
      handle,
      middlewares: [],
      listners: new PublishBus(),
    });

    return this;
  }

  public use(middleware: Middleware<any>, command?: Command | undefined): this {
    if (!command) {
      this.globalMiddlewares.push(middleware);

      return this;
    }
    const commandContext = this.getCommand(command);
    commandContext.middlewares.push(middleware);

    return this.updateContext(commandContext);
  }

  public subscribeCommand(command: Command, observer: Observer): this {
    const commandContext = this.getCommand(command);
    commandContext.listners.subscribe(observer);

    return this.updateContext(commandContext);
  }

  public unsubscribeCommand(command: Command, observer: Observer): this {
    const commandContext = this.getCommand(command);
    commandContext.listners.unsubscribe(observer);

    return this.updateContext(commandContext);
  }

  public async execute<T>(command: Command): Promise<T> {
    const commandContext = this.getCommand(command);
    const middlewares = [
      ...this.globalMiddlewares,
      ...commandContext.middlewares,
    ];
    await MiddlewareBus.invoke(commandContext, middlewares);
    try {
      const result = (await commandContext.handle.execute(command)) as T;
      commandContext.listners.notify({
        req: command,
        res: result,
        error: undefined,
      });
      return result;
    } catch (error) {
      commandContext.listners.notify({ req: command, res: undefined, error });
      throw error;
    }
  }
}
