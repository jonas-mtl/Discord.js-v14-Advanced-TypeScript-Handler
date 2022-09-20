import { PrefixCommand } from 'Structures/Interfaces/interfaces.js';
import { BaseClient } from '../Classes/client.js';
import { pathToFileURL } from 'url';
import { promisify } from 'util';

import ConsoleLogger from '../Classes/consoleLogger.js';
import AsciiTable from 'ascii-table';
import chalk from 'chalk';
import glob from 'glob';
import path from 'path';

const PG = promisify(glob);
const logger = new ConsoleLogger();

export default class PrefixCommandsHandler {
  constructor() {}
  public async loadPrefixCommands(client: BaseClient) {
    let CommandsTable = new AsciiTable().setHeading('⠀⠀⠀⠀⠀', '⠀⠀⠀⠀⠀⠀⠀⠀⠀Prefix Commands⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀', '⠀⠀Status⠀⠀').setBorder('┋', '═', '●', '●').setAlign(2, AsciiTable.CENTER);
    const CmdsDir = await PG(`${process.cwd()}/dist/PrefixCommands/*/*{.ts,.js}`);
    await Promise.all(
      CmdsDir.map(async (file, i) => {
        const commandPath = path.resolve(file);
        const command: PrefixCommand = (await import(`${pathToFileURL(commandPath)}`)).default;

        if (command) {
          client.prefixCommands.set(command.name, command);
          CommandsTable.addRow((i + 1).toString() + '.', file.split(/[\\/]/).pop(), '» 🌱 «');

          //Register Aliases
          if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach((alias) => {
              client.prefixCommandsAlias.set(alias, command.name);
            });
          }
        } else CommandsTable.addRow((i + 1).toString() + '.', file.split(/[\\/]/).pop(), '» 🔆 «');
      })
    );

    if (CmdsDir.length === 0) CommandsTable.addRow('0.', 'Missing Commands', '» 🔆 «');
    console.log(chalk.white(CommandsTable.toString()));

    client.currentStatus++;
    client.checkStatus();

    setTimeout(() => {
      logger.info('Prefix Commands • loaded');
    }, 500);
  }
}
