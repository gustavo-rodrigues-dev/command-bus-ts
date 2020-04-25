import { before } from 'mocha';
import { expect } from 'chai';
import { Publisher } from '../../../../../src/domain/publisher';
import { DefaultPublisher } from '../../../../../src/domain/publisher/service/default-publisher';

describe('DefaultPublisher', () => {
  let context: Publisher;
  beforeEach(() => {
    context = new DefaultPublisher();
  });
  describe('subscribe()', () => {
    before(() => {
      context = new DefaultPublisher();
    });

    it('Should subscribe successfully');
    it('Should not be two identical subscriptions');
  });
  describe('unsubscribe()', () => {
    before(() => {
      context = new DefaultPublisher();
    });
    it('Should unsubscribe successfully');
    it('Should return error when removing a non-existent subscription');
  });
  describe('notify()', () => {
    before(() => {
      context = new DefaultPublisher();
    });
    it('Should notfy a subscribe successfully');
    it('Should not return error when notifying if there are no subscribers');
    it(
      'Should return a single error containing the errors of the subscripts that failed'
    );
    it(
      'Should return an error if a subscript fails, but this should not affect other subscriptions'
    );
  });
});
