import { Command } from '../command';
import { Handle } from '../handle';
import { Middleware } from '../middleware';
import { Observer } from '../observer';
/**
 * Interface of Disptcher
 *
 * @export
 * @interface Dispatch
 */
export interface Dispatch {
  /**
   * Execute is a method responsible to execute handle a command and
   * call yours middlewares and dispatch this response to all subscribers
   *
   * @template T
   * @param {Command} command
   * @returns {Promise<T>}
   * @memberof Dispatch
   */
  execute<T>(command: Command): Promise<T>;
  /**
   * registerCommand is a Method responsible to register a command and your handle
   *
   * @param {string | Symbol} commandName
   * @param {Handle} handle
   * @returns {this}
   * @memberof Dispatch
   */
  registerCommand(commandName: String | Symbol, handle: Handle): this;
  /**
   * use is responsible to register a global middleware or a middleware to a especific command
   *
   * @param {Middleware<any>} middleware
   * @param {string | Symbol | undefined} commandName
   * @returns {this}
   * @memberof Dispatch
   */
  use(middleware: Middleware<any>, commandName?: String | Symbol): this;
  /**
   * subscribeCommand is responsible to register a observable
   * to listen all responses of some command
   *
   * @param {string | Symbol} commandName
   * @param {Observer} observer
   * @returns {this}
   * @memberof Dispatch
   */
  subscribeCommand(commandName: String | Symbol, observer: Observer): this;
  /**
   * unsubscribeCommand is responsible to unregister a observable
   * to listen all responses of some command
   *
   * @param {string | Symbol} commandName
   * @param {Observer} observer
   * @returns {this}
   * @memberof Dispatch
   */
  unsubscribeCommand(commandName: String | Symbol, observer: Observer): this;
}
