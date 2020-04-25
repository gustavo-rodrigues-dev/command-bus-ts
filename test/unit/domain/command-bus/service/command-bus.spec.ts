import { before } from 'mocha';
import { expect } from 'chai';
import { Dispatch } from '../../../../../src/domain/command-bus/';
import { CommandBus } from '../../../../../src/domain/command-bus/service/command-bus';

describe('CommandBus', () => {
  let context: Dispatch;
  beforeEach(() => {
    context = new CommandBus();
  });
  describe('getCommand()', () => {
    before(() => {
      context = new CommandBus();
    });
  });
  describe('updateContext()', () => {
    before(() => {
      context = new CommandBus();
    });
  });
  describe('registerCommand()', () => {
    before(() => {
      context = new CommandBus();
    });
  });
  describe('registerCommand()', () => {
    before(() => {
      context = new CommandBus();
    });
  });
  describe('use()', () => {
    before(() => {
      context = new CommandBus();
    });
  });
  describe('subscribeCommand()', () => {
    before(() => {
      context = new CommandBus();
    });

    it('Should subscribe a command successfully');
    it('Should not be two identical subscriptions to a command');
  });
  describe('unsubscribeCommand()', () => {
    before(() => {
      context = new CommandBus();
    });
    it('Should unsubscribe a command successfully');
    it(
      'Should return error when removing a non-existent subscription on a command'
    );
  });
  describe('execute()', () => {
    before(() => {
      context = new CommandBus();
    });
  });
});
