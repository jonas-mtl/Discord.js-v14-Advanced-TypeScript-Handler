import chalk from 'chalk';

export default class ConsoleLogger {
  private origin: string;

  constructor() {
    this.origin = this._getLogOrigin().split(/[\\/]/).pop();
  }

  private _getLogOrigin() {
    let filename: any;

    let _pst = Error.prepareStackTrace;
    Error.prepareStackTrace = function (err, stack) {
      return stack;
    };
    try {
      let err: any = new Error();
      let callerfile: string;
      let currentfile: string;

      currentfile = err.stack.shift().getFileName();

      while (err.stack.length) {
        callerfile = err.stack.shift().getFileName();

        if (currentfile !== callerfile) {
          filename = callerfile;
          break;
        }
      }
    } catch (err) {}
    Error.prepareStackTrace = _pst;

    return filename;
  }

  public error(content: string): void {
    console.log(
      chalk.grey(new Date().toLocaleTimeString()) +
        `  ❗️ [` +
        chalk.red.bold(`${this.origin.length > 25 ? this.origin.substring(0, 17) + '...' : this.origin}`) +
        `] ` +
        ' '.repeat(25 - (this.origin.length > 25 ? 25 : this.origin.length)) +
        '| ' +
        content
    );
  }

  public info(content: string): void {
    console.log(
      chalk.grey(new Date().toLocaleTimeString()) +
        `  🔆  [` +
        chalk.yellow.bold(`${this.origin.length > 25 ? this.origin.substring(0, 17) + '...' : this.origin}`) +
        `] ` +
        ' '.repeat(25 - (this.origin.length > 25 ? 25 : this.origin.length)) +
        '| ' +
        content
    );
  }

  public success(content: string): void {
    console.log(
      chalk.grey(new Date().toLocaleTimeString()) +
        `  ❇️  [` +
        chalk.green.bold(`${this.origin.length > 25 ? this.origin.substring(0, 17) + '...' : this.origin}`) +
        `] ` +
        ' '.repeat(25 - (this.origin.length > 25 ? 25 : this.origin.length)) +
        '| ' +
        content
    );
  }

  public custom(content: string, emoji: string, color: 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white', brightColor?: boolean): void {
    console.log(color, brightColor);
    console.log(
      chalk.grey(new Date().toLocaleTimeString()) +
        `  ${emoji}  [` +
        chalk.bold[`${color}${brightColor ? 'Bright' : ''}`](`${this.origin.length > 20 ? this.origin.substring(0, 17) + '...' : this.origin}`) +
        `] ` +
        ' '.repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
        '| ' +
        content
    );
  }
}
