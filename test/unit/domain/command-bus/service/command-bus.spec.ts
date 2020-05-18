import { before } from 'mocha';
import { expect } from 'chai';
import { Dispatch } from '../../../../../src/domain/command-bus/';
import { CommandBus } from '../../../../../src/domain/command-bus/service/command-bus';
import { Command } from '../../../../../src/domain/command';
import { Handle } from '../../../../../src/domain/handle';
import { Context } from '../../../../../src/domain/command-bus/model/context';
import * as sinon from 'sinon';
import { Next, Middleware } from '../../../../../src/domain/middleware';
import { match } from 'assert';
import { Observer } from '../../../../../src/domain/observer';

describe('CommandBus', () => {
  let context: Dispatch;
  describe('getCommand()', () => {
    let command: Command;
    let handle: Handle;
    beforeEach(() => {
      context = new CommandBus();
      command = {
        commandName: 'foo',
      };
      handle = {
        execute: (): any => {},
      };

      context.registerCommand(command, handle);
    });
    it('Should get a command', () => {
      const x = context as any;
      const commandFoo = x.getCommand(command) as Context;
      expect(commandFoo.command.commandName).to.be.equal(command.commandName);
      expect(commandFoo.handle).to.be.equal(handle);
      expect(commandFoo.listners.subscribers.size).to.be.equal(0);
      expect(commandFoo.middlewares.length).to.be.equal(0);
    });
    it('Should return error get command when comand not found', () => {
      const x = context as any;
      let err;
      try {
        x.getCommand({ commandName: 'bar' }) as Context;
      } catch (error) {
        err = error;
      }
      expect(err.message).to.be.equal('Context not found');
    });
  });
  describe('updateContext()', () => {
    let command: Command;
    let handle: Handle;
    beforeEach(() => {
      context = new CommandBus();
      command = {
        commandName: 'foo',
      };
      handle = {
        execute: (): any => {},
      };

      context.registerCommand(command, handle);
    });
    it('Should update a command', () => {
      const commandFoo = (context as any).getCommand(command);
      commandFoo.command.bar = 'bar';
      (context as any).updateContext(commandFoo);
      const updatedCommand = (context as any).getCommand(commandFoo.command);
      expect(updatedCommand.command.bar).to.be.equal('bar');
      expect(updatedCommand.handle).to.be.equal(commandFoo.handle);
      expect(updatedCommand.listners.subscribers.size).to.be.equal(
        commandFoo.listners.subscribers.size
      );
      expect(updatedCommand.middlewares.length).to.be.equal(
        commandFoo.middlewares.length
      );
    });
    it('Should return error uptade command when comand not found to update', () => {
      let err;
      try {
        (context as any).updateContext({
          command: { commandName: 'bar' },
        }) as Context;
      } catch (error) {
        err = error;
      }
      expect(err.message).to.be.equal('Context not found');
    });
  });
  describe('registerCommand()', () => {
    let command: Command;
    let handle: Handle;

    beforeEach(() => {
      context = new CommandBus();
    });
    afterEach(() => {
      sinon.restore();
    });
    it('Should register a command', () => {
      sinon.spy((context as any).context, 'set');
      command = {
        commandName: 'foo',
      };
      handle = {
        execute: (): any => {},
      };
      context.registerCommand(command, handle);
      expect((context as any).context.set).to.have.been.calledOnce;
      expect(
        (context as any).context.get(command.commandName).command
      ).to.be.deep.equal(command);
    });
    it('Should return error register a command where dont have commandName', () => {
      sinon.spy((context as any).context, 'set');
      command = {} as Command;
      handle = {
        execute: (): any => {},
      };
      let err;

      try {
        context.registerCommand(command, handle);
      } catch (error) {
        err = error;
      }
      expect((context as any).context.set).to.have.been.callCount(0);
      expect(err.message).to.be.equal('Command dont have commandName');
    });
  });
  describe('use()', () => {
    let command: Command;
    let handle: Handle;
    beforeEach(() => {
      context = new CommandBus();
      command = {
        commandName: 'foo',
      };
      handle = {
        execute: (): any => {},
      };
      context.registerCommand(command, handle);
      sinon.spy((context as any).globalMiddlewares, 'push');
      sinon.spy(context as any, 'getCommand');
    });
    afterEach(() => {
      sinon.restore();
    });
    it('Should register a global Middleware', () => {
      function middleware(context: any, next: Next) {
        return next();
      }
      context.use(middleware);
      expect(
        (context as any).globalMiddlewares.push
      ).to.have.been.calledOnceWith(middleware);
      expect((context as any).globalMiddlewares).to.have.members([middleware]);
    });
    it('Should register a command Middleware', () => {
      sinon.spy(
        (context as any).context.get(command.commandName).middlewares,
        'push'
      );
      function middleware(context: any, next: Next) {
        return next();
      }
      context.use(middleware, command);
      expect((context as any).getCommand).to.have.been.calledOnceWith(command);
      expect(
        (context as any).context.get(command.commandName).middlewares
      ).to.have.members([middleware]);
      expect(
        (context as any).context.get(command.commandName).middlewares.push
      ).to.have.been.calledOnceWith(middleware);
    });
    it('Should return error on register a command Middleware where Command is not defined', () => {
      const newCommand = {
        commandName: 'aaa',
      };
      let err;
      function middleware(context: any, next: Next) {
        return next();
      }
      try {
        context.use(middleware, newCommand);
      } catch (error) {
        err = error;
      }

      expect((context as any).getCommand).to.have.been.calledOnceWith(
        newCommand
      );
      expect(err.message).to.be.equal('Context not found');
    });
  });
  describe('subscribeCommand()', () => {
    let command: Command;
    let handle: Handle;
    beforeEach(() => {
      context = new CommandBus();
      command = {
        commandName: 'foo',
      };
      handle = {
        execute: (): any => {
          return 'bar';
        },
      };
      context.registerCommand(command, handle);
      sinon.spy(context as any, 'getCommand');
      sinon.spy(
        (context as any).context.get(command.commandName).listners,
        'subscribe'
      );
    });
    afterEach(() => {
      sinon.restore();
    });

    it('Should subscribe a command successfully', () => {
      const subscriber = {
        update: (res: any) => {
          return;
        },
      };
      context.subscribeCommand(command, subscriber);
      expect(
        (context as any).context
          .get(command.commandName)
          .listners.subscribers.has(subscriber)
      ).to.be.true;
      expect((context as any).getCommand).to.have.been.calledOnceWith(command);
      expect(
        (context as any).context.get(command.commandName).listners.subscribe
      ).to.have.been.calledOnceWith(subscriber);
    });
  });
  describe('unsubscribeCommand()', () => {
    let command: Command;
    let handle: Handle;
    let subscriber: Observer;
    beforeEach(() => {
      context = new CommandBus();
      command = {
        commandName: 'foo',
      };
      handle = {
        execute: (): any => {
          return 'bar';
        },
      };
      context.registerCommand(command, handle);
      subscriber = {
        update: (res: any) => {
          return;
        },
      };
      context.subscribeCommand(command, subscriber);
      sinon.spy(context as any, 'unsubscribeCommand');
      sinon.spy(context as any, 'getCommand');
      sinon.spy(
        (context as any).context.get(command.commandName).listners,
        'unsubscribe'
      );
    });
    afterEach(() => {
      sinon.restore();
    });
    it('Should unsubscribe a command successfully', () => {
      context.unsubscribeCommand(command, subscriber);
      expect(
        (context as any).context
          .get(command.commandName)
          .listners.subscribers.has(subscriber)
      ).to.be.false;
      expect((context as any).getCommand).to.have.been.calledOnceWith(command);
      expect(
        (context as any).context.get(command.commandName).listners.unsubscribe
      ).to.have.been.calledOnceWith(subscriber);
    });
    it('Should return error when removing a non-existent subscription on a command', () => {
      const newCommand = {
        commandName: 'newCommand',
      };
      let err;
      try {
        context.unsubscribeCommand(newCommand, subscriber);
      } catch (error) {
        err = error;
      }
      expect((context as any).getCommand).to.have.been.calledOnceWith(
        newCommand
      );
      expect(err.message).to.be.equal('Context not found');
    });
  });
  describe('execute()', () => {
    let command: Command;
    let handle: Handle;
    let subscriber: Observer;
    let middleware: Middleware<any>;
    beforeEach(() => {
      context = new CommandBus();
      command = {
        commandName: 'foo',
      };
      handle = {
        execute: (): any => {
          return 'bar';
        },
      };
      middleware = sinon.stub().callsFake((context: any, next: Next) => {
        return next();
      });
      subscriber = {
        update: (res: any) => {
          return;
        },
      };
      context
        .registerCommand(command, handle)
        .use(middleware, command)
        .subscribeCommand(command, subscriber);
      sinon.spy(handle, 'execute');
      sinon.spy(subscriber, 'update');
      sinon.spy(context, 'registerCommand');
      sinon.spy(context as any, 'getCommand');
      sinon.spy(
        (context as any).context.get(command.commandName).listners,
        'notify'
      );
    });
    afterEach(() => {
      sinon.restore();
    });
    it('Should execute a command successfully', async () => {
      const result = await context.execute(command);
      expect(result).to.be.equal('bar');
      expect((context as any).getCommand).to.have.been.calledOnceWith(command);
      expect(middleware).to.have.been.calledOnce;
      expect(handle.execute).to.have.been.calledOnceWith(command);
      expect(subscriber.update).to.have.been.calledOnceWith({
        req: command,
        res: 'bar',
        error: undefined,
      });
    });
    it('Should return error on execute a command where command not found', async () => {
      const newCommand = {
        commandName: 'newCommand',
      };
      let err;
      try {
        await context.execute(newCommand);
      } catch (error) {
        err = error;
      }
      expect((context as any).getCommand).to.have.been.calledOnceWith(
        newCommand
      );
      expect(err.message).to.be.equal('Context not found');
    });
    it('Should return error on execute a command where handle fail', async () => {
      const newCommand = {
        commandName: 'newCommand',
      };

      const newHandle: Handle = {
        execute: sinon.stub().throws(new Error('Some Error')),
      };

      context
        .registerCommand(newCommand, newHandle)
        .subscribeCommand(newCommand, subscriber)
        .use(middleware, newCommand);

      let err;
      try {
        await context.execute(newCommand);
      } catch (error) {
        err = error;
      }
      expect((context as any).getCommand).to.have.been.callCount(3);
      expect(middleware).to.have.been.calledOnce;
      expect(newHandle.execute).to.have.been.calledOnceWith(newCommand);
      expect(subscriber.update).to.have.been.calledOnceWith({
        req: newCommand,
        res: undefined,
        error: err,
      });
      expect(err.message).to.be.equal('Some Error');
    });
    it('Should execute a command successfully where has healtly middleware', async () => {
      const newMiddleware = (self: any, next: Next) => {
        self.command.foo = 'bar';
        return next();
      };
      const originalCommand = Object.assign({}, command);

      context.use(newMiddleware, command);
      const result = await context.execute(command);
      expect(result).to.be.equal('bar');
      expect(middleware).to.have.been.calledOnce;
      expect(handle.execute).to.have.been.calledOnceWithExactly({
        ...originalCommand,
        foo: 'bar',
      });
      expect(subscriber.update).to.have.been.calledOnceWithExactly({
        req: {
          ...originalCommand,
          foo: 'bar',
        },
        res: 'bar',
        error: undefined,
      });
    });
    it('Should return error on execute a command where has unhealtly middleware', async () => {
      const newMiddleware = (self: any, next: Next) => {
        throw new Error('Some Error');
      };
      context.use(newMiddleware, command);

      let result;
      let err;
      try {
        result = await context.execute(command);
      } catch (error) {
        err = error;
      }

      expect(result).to.be.equal(undefined);
      expect(middleware).to.have.been.calledOnce;
      expect(handle.execute).to.have.been.callCount(0);
      expect(subscriber.update).to.have.been.calledOnceWithExactly({
        req: command,
        res: undefined,
        error: err,
      });
    });
    it('Should execute a command successfully where has unhealtly subscriber', async () => {
      const errorSubscriber = {
        update: sinon.stub().throws(new Error('Some Error')),
      };

      let result;
      let err;
      context.subscribeCommand(command, errorSubscriber);
      try {
        result = await context.execute(command);
      } catch (error) {
        err = error;
      }
      expect(result).to.be.equal('bar');
      expect((context as any).getCommand).to.have.been.calledWithExactly(
        command
      );
      expect(middleware).to.have.been.calledOnce;
      expect(handle.execute).to.have.been.calledOnceWith(command);
      expect(subscriber.update).to.have.been.calledOnceWith({
        req: command,
        res: 'bar',
        error: undefined,
      });
    });
  });
});
