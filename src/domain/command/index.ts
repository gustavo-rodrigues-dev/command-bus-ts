/**
 * Interface of Command
 *
 * @export
 * @interface Command
 * @since 1.0.0
 */
export interface Command {
  /**
   * proprety commandName is identifier of command
   *
   * @type {(string | Symbol)}
   * @memberof Command
   * @since 1.0.0
   */
  commandName: string | Symbol;
}
