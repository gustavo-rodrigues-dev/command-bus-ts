/**
 * Interface of Command
 *
 * @export
 * @interface Command
 */
export interface Command {
  /**
   * proprety commandName is identifier of command
   *
   * @type {(string | Symbol)}
   * @memberof Command
   */
  commandName: string | Symbol;
}
