import { before } from 'mocha';
import { handleCommand, Dispatcher } from '../../src/index';
import { DispatchCommand } from '../../src/dispatch';
import { expect } from 'chai';
import ContextManager from '../../src/context/context-manager';

describe('handleCommand', () => {
  let dispacher: DispatchCommand;
  let context: ContextManager;
  before(() => {
    dispacher = new Dispatcher();
    context = ContextManager.getInstance();
  });
  it('Shoud return result of executable Foo.bar before declare command dispatch handle', async () => {
    @handleCommand('foo', 'bar')
    class Foo {
      public bar(str: string) {
        return str;
      }
    }

    const x = await dispacher.dispatch('foo', 'bar');
    expect(x).to.be.equal('bar');
  });

  it('Shoud return result of executable Foo.excute before declare command dispatch handle execute', async () => {
    @handleCommand('X')
    class Foo {
      public execute(str: string) {
        return str;
      }
    }

    const x = await dispacher.dispatch('foo', 'bar');
    expect(x).to.be.equal('bar');
  });

  it('Shoud return error on dont define handle method', async () => {
    try {
      @handleCommand('bar', 'execute')
      class X {}
    } catch (e) {
      expect(e.message).to.be.equal('Method Call of handle dont exists');
    }
  });

  it('Shoud return error on set new foo command', async () => {
    try {
      @handleCommand('foo', 'execute')
      class X {
        public execute(str: string) {
          return str;
        }
      }
    } catch (e) {
      expect(e.message).to.be.equal('Command has ben defined');
    }
  });
});
