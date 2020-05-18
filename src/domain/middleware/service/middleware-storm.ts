import { Middleware } from '..';

/**
 * Class are responsible to execute all middlewares
 *
 * @export
 * @class MiddlewareStorm
 */
export class MiddlewareStorm {
  /**
   * Method invoke is responsible to run a sequence of middlewares
   *
   * @static
   * @template T
   * @param {T} context
   * @param {Middleware<T>[]} middlewares
   * @returns {Promise<void>}
   * @memberof MiddlewareStorm
   */
  public static async invoke<T>(
    context: T,
    middlewares: Middleware<T>[]
  ): Promise<void> {
    if (!middlewares.length) return;

    const middleware = middlewares[0];

    return middleware(context, async () => {
      await MiddlewareStorm.invoke(context, middlewares.slice(1));
    });
  }
}
