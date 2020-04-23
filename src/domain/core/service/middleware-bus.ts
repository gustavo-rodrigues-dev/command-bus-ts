import { Middleware } from '../../middleware';

export class MiddlewareBus {
  public static async invoke<T>(
    context: T,
    middlewares: Middleware<T>[],
  ): Promise<void> {
    if (!middlewares.length) return;

    const middleware = middlewares[0];

    return middleware(context, async () => {
      await MiddlewareBus.invoke(context, middlewares.slice(1));
    });
  }
}
