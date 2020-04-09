import ContextManager from './context/context-manager';
import { CommandContext } from './context';
export { Dispatcher } from './dispatch/dispatcher';
export function handleCommand(
  namespace: string,
  methodCall: string = 'execute',
) {
  return function (target: any) {
    const instance = ContextManager.getInstance();
    const call = target.prototype[methodCall];
    if (!call) {
      throw new Error('Method Call of handle dont exists');
    }
    const command: CommandContext = {
      namespace,
      handle: call,
    };

    instance.set(command);
  };
}
