import { CommandContext } from '.';

export default class ContextManager {
  private static instance: ContextManager;
  private readonly context: Map<string, CommandContext> = new Map();
  private constructor() {}

  public static getInstance(): ContextManager {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager();
    }

    return ContextManager.instance;
  }

  public set(command: CommandContext): void {
    if (this.context.has(command.namespace)) {
      throw new Error('Command has ben defined');
    }

    this.context.set(command.namespace, command);
  }

  public setHandle(namespace: string, handle: any): void {
    const command = this.get(namespace);
    if (command && command.handle) {
      throw new Error('Handle has ben defined');
    }

    command.handle = handle;
    this.context.set(command.namespace, command);
  }

  public has(command: CommandContext) {
    this.context.has(command.namespace);
  }

  public get(namespace: string): CommandContext {
    const command = this.context.get(namespace);
    if (!command) {
      throw new Error('Command not found');
    }
    return command;
  }
}
