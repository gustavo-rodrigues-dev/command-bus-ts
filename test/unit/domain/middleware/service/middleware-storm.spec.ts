import { before } from 'mocha';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { MiddlewareStorm } from '../../../../../src/domain/middleware/service/middleware-storm';
import { Middleware, Next } from '../../../../../src/domain/middleware';

describe('MiddlewareStorm', () => {
  describe('invoke()', () => {
    beforeEach(() => {
      sinon.spy(MiddlewareStorm, 'invoke');
    });
    afterEach(() => {
      sinon.restore();
    });
    it('Should invoke middleware successfully', () => {
      const message = 'ok';
      const middlewareStub = sinon
        .stub()
        .callsFake((context: any, next: Next) => {
          return next();
        });
      MiddlewareStorm.invoke(message, [middlewareStub]);
      expect(MiddlewareStorm.invoke).to.have.been.calledTwice;
      expect(middlewareStub).to.have.been.calledOnce;
      expect(middlewareStub.args[0][0]).to.be.equal(message);
    });
    it('Should invoke alist of middleware successfully', () => {
      const message = 'ok';
      const middlewareStub1 = sinon
        .stub()
        .callsFake((context: any, next: Next) => {
          return next();
        });
      const middlewareStub2 = sinon
        .stub()
        .callsFake((context: any, next: Next) => {
          return next();
        });
      MiddlewareStorm.invoke(message, [middlewareStub1, middlewareStub2]);
      expect(MiddlewareStorm.invoke).to.have.been.callCount(3);
      expect(middlewareStub1).to.have.been.calledOnce;
      expect(middlewareStub1.args[0][0]).to.be.equal(message);
      expect(middlewareStub2).to.have.been.calledOnce;
      expect(middlewareStub2.args[0][0]).to.be.equal(message);
    });
    it('Should return error if any middleware fails', async () => {
      const message = 'ok';
      const middlewareStub1 = sinon
        .stub()
        .callsFake((context: any, next: Next) => {
          throw new Error('any');
        });
      const middlewareStub2 = sinon
        .stub()
        .callsFake((context: any, next: Next) => {
          return next();
        });
      let err = undefined;
      try {
        await MiddlewareStorm.invoke(message, [
          middlewareStub1,
          middlewareStub2,
        ]);
      } catch (error) {
        err = error;
      }
      expect(MiddlewareStorm.invoke).to.have.been.calledOnce;
      expect(err.message).to.be.equal('any');
      expect(middlewareStub1).to.have.been.calledOnce;
      expect(middlewareStub1.args[0][0]).to.be.equal(message);
      expect(middlewareStub2).to.have.been.callCount(0);
    });
  });
});
