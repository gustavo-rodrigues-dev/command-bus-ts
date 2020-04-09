import { before } from 'mocha';
import { handleCommand } from '../../src/index';
import { DispatchCommand } from '../../src/dispatch';
import { Dispatcher } from '../../src/dispatch/dispatcher';
import { expect } from 'chai';
import ContextManager from '../../src/context/context-manager';
import { CommandContext } from '../../src/context';

describe('handleCommand', () => {
  let dispacher: DispatchCommand;
  let context: ContextManager;
  before(() => {
    dispacher = new Dispatcher();
    context = ContextManager.getInstance();
  });
  it('Shoud return result of executable Foo.execute before declare command dispatch handle', async () => {
    @handleCommand('foo', 'execute')
    class Foo {
      public execute(str: string) {
        return str;
      }
    }

    const x = await dispacher.dispatch('foo', 'bar');
    expect(x).to.be.equal('bar');
  });

  it('Shoud return error on set new foo command', async () => {
    try {
      @handleCommand('foo', 'bar')
      class X {
        public bar(str: string) {
          return str;
        }
      }
    } catch (e) {
      expect(e.message).to.be.equal('Command has ben defined');
    }
  });
});
