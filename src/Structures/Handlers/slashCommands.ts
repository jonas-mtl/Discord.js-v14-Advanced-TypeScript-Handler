import { SlashCommand } from '../Interfaces/interfaces.js';
import { BaseClient } from '../Classes/client.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { pathToFileURL } from 'url';
import { promisify } from 'util';

import ConsoleLogger from '../Classes/consoleLogger.js';
import AsciiTable from 'ascii-table';
import chalk from 'chalk';
import glob from 'glob';
import path from 'path';

const logger = new ConsoleLogger();
const PG = promisify(glob);

export default class SlashCommandsHandler {
  constructor() {}
  public async loadSlashCommands(client: BaseClient, reloading?: boolean) {
    let CmdArray: any[] = [];
    let DevArray: any[] = [];

    const CommandsTable = new AsciiTable().setHeading('⠀⠀⠀⠀⠀', '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Slash Commands⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀', '⠀⠀Status⠀⠀').setBorder('┋', '═', '●', '●').setAlign(2, AsciiTable.CENTER);
    const CmdsDir = await PG(`${process.cwd()}/dist/SlashCommands/*/*{.ts,.js}`);

    await Promise.all(
      CmdsDir.map(async (file, i) => {
        CommandsTable.addRow((i + 1).toString() + '.', file.split(/[\\/]/).pop(), '» 🌱 «');

        const commandPath = path.resolve(file);
        const command: SlashCommand = (await import(`${pathToFileURL(commandPath)}`)).default;

        if (file.endsWith('.dev.ts') || file.endsWith('.dev.js')) {
          DevArray.push(command.data.toJSON());

          client.slashCommands.set(command.data.name, command);
        } else {
          CmdArray.push(command.data.toJSON());
          client.slashCommands.set(command.data.name, command);
        }
        client.application?.commands.set(CmdArray);
        client.config.DevGuilds.forEach(async (guild) => {
          await client.guilds.cache.get(guild.id)?.commands.set(DevArray);
        });
      })
    );
    const rest = new REST({ version: '10' }).setToken(client.config.TOKEN);

    if (CmdsDir.length === 0) CommandsTable.addRow('0.', 'Missing Commands', '» 🔆 «');
    if (!reloading) {
      console.log(chalk.white(CommandsTable.toString()), chalk.green.bold(`\n\n⠀⠀⠀⠀⠀⠀--- Djs.14 TYPESCRIPT Command Handler ---\n${' '.repeat(12)}-> DM Jonas#1713 for help \n\n`));
    }

    await (async () => {
      try {
        if (client.config.DEVELOPMENT) {
          await rest.put(Routes.applicationGuildCommands(client.config.CLIENT_ID, client.config.DevGuilds[0].id), {
            body: [...CmdArray, ...DevArray],
          });
          logger.info(`Dev mode • Slash Commands registered for guild "${client.config.DevGuilds[0].name}"`);
        } else {
          await rest.put(Routes.applicationCommands(client.config.CLIENT_ID), {
            body: CmdArray,
          });
          await rest.put(Routes.applicationGuildCommands(client.config.CLIENT_ID, client.config.DevGuilds[0].id), {
            body: DevArray,
          });
          logger.info(`Production mode • Slash Commands registered globally`);
        }
        if (!reloading) {
          logger.info('Slash Commands • loaded');
          client.currentStatus++;
          client.checkStatus();
        } else {
          return 'loaded';
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }
}
