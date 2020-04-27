import * as sinon from 'sinon';
import { expect } from 'chai';
import { Publisher } from '../../../../../src/domain/publisher';
import { DefaultPublisher } from '../../../../../src/domain/publisher/service/default-publisher';
import { Observer } from '../../../../../src/domain/observer';
import { MultiError } from 'VError';

describe('DefaultPublisher', () => {
  let context: Publisher;
  beforeEach(() => {
    context = new DefaultPublisher();
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('subscribe()', () => {
    beforeEach(() => {
      context = new DefaultPublisher();
    });

    it('Should subscribe successfully', () => {
      const subscriber: Observer = {
        update: (res: any) => {
          return;
        },
      };
      context.subscribe(subscriber);
      expect(context.subscribers.has(subscriber)).to.be.true;
      expect(context.subscribers.size).to.be.eq(1);
    });
    it('Should not be two identical subscriptions', () => {
      const subscriber: Observer = {
        update: (res: any) => {
          return;
        },
      };
      context.subscribe(subscriber).subscribe(subscriber);

      expect(context.subscribers.has(subscriber)).to.be.true;
      expect(context.subscribers.size).to.be.eq(1);
    });
  });
  describe('unsubscribe()', () => {
    let subscriber: Observer;
    beforeEach(() => {
      context = new DefaultPublisher();
      subscriber = {
        update: (res: any) => {
          return;
        },
      };
      context.subscribe(subscriber);
    });
    it('Should unsubscribe successfully', () => {
      expect(context.subscribers.has(subscriber)).to.be.true;

      context.unsubscribe(subscriber);

      expect(context.subscribers.has(subscriber)).to.be.false;
    });
    it('Should return error when removing a non-existent subscription', () => {
      expect(context.subscribers.has(subscriber)).to.be.true;
      const observablex = {
        update: () => {
          return;
        },
      };

      expect(context.subscribers.has(observablex)).to.be.false;
      try {
        context.unsubscribe(observablex);
      } catch (error) {
        expect(error.message).to.be.equal(
          'Subscriber do not exists to unsubscribe'
        );
      }

      expect(context.subscribers.has(observablex)).to.be.false;
      expect(context.subscribers.has(subscriber)).to.be.true;
    });
  });
  describe('notify()', () => {
    beforeEach(() => {
      context = new DefaultPublisher();
    });
    afterEach(() => {
      sinon.restore();
    });

    it('Should notfy a subscribe successfully', () => {
      const message = 'foo';
      const subscriber: Observer = {
        update: (req: any) => {
          expect(req).to.be.equal(message);
        },
      };
      sinon.spy(subscriber, 'update');

      context.subscribe(subscriber);
      context.notify(message);

      expect(subscriber.update).to.have.been.calledOnceWithExactly(
        sinon.match.any
      );
    });
    it('Should not return error when notifying if there are no subscribers', () => {
      const message = 'foo';
      sinon.spy(context, 'notify');
      expect(context.subscribers.size).to.be.equal(0);
      context.notify(message);
      expect(context.notify).to.have.been.calledOnceWithExactly(
        sinon.match.any
      );
    });
    it('Should return a single error containing the errors of the subscriber that failed, but not affect all subscribers', () => {
      const message = 'foo';
      const healtlySubscriber: Observer = {
        update: (req: any) => {
          expect(req).to.be.equal(message);
        },
      };

      const unhealtlySubscriber: Observer = {
        update: (req: any) => {
          expect(req).to.be.equal(message);
          throw new Error('bar');
        },
      };

      sinon.spy(context, 'notify');
      sinon.spy(context, 'subscribe');
      sinon.spy(healtlySubscriber, 'update');
      sinon.spy(unhealtlySubscriber, 'update');
      context.subscribe(unhealtlySubscriber).subscribe(healtlySubscriber);
      let err;
      try {
        context.notify(message);
      } catch (error) {
        err = error;
      }
      expect(context.subscribe).to.have.callCount(2);
      expect(context.notify).to.have.been.calledWithExactly(sinon.match.any);
      expect(healtlySubscriber.update).to.have.been.calledOnceWithExactly(
        sinon.match.any
      );
      expect(unhealtlySubscriber.update).to.have.been.calledOnceWithExactly(
        sinon.match.any
      );
      expect(err).to.be.an.instanceOf(MultiError);
      expect(err.message).to.be.equal('first of 1 error: bar');
      expect(err.errors().length).to.be.equal(1);
      expect(err.errors()[0].message).to.be.equal('bar');
    });
  });
});
