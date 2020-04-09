import { DispatchCommand } from '.';
import ContextManager from '../context/context-manager';
export class Dispatcher implements DispatchCommand {
  public async dispatch<T>(namespace: string, propreties: any): Promise<T> {
    const instance = ContextManager.getInstance();
    const command = instance.get(namespace);

    if (!command.handle) {
      throw new Error('Command dont have Handle');
    }

    return command.handle(propreties);
  }
}
