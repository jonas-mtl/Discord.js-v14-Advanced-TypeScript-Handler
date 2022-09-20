import { ClientEvent } from 'Structures/Interfaces/interfaces.js';
import { BaseClient } from '../Classes/client.js';
import { pathToFileURL } from 'url';
import { promisify } from 'util';

import ConsoleLogger from '../Classes/consoleLogger.js';
import AsciiTable from 'ascii-table';
import chalk from 'chalk';
import glob from 'glob';
import path from 'path';

const logger = new ConsoleLogger();
const PG = promisify(glob);

export default class ClientEventsHandler {
  constructor() {}

  public async loadEvents(client: BaseClient, reloading?: boolean) {
    const EventsTable = new AsciiTable().setHeading('⠀⠀⠀⠀⠀', '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Events⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀', '⠀⠀Status⠀⠀').setBorder('┋', '═', '●', '●').setAlign(2, AsciiTable.CENTER);
    const EventsDir = await PG(`${process.cwd()}/dist/ClientEvents/*/*{.ts,.js}`);

    EventsDir.forEach(async (file, i) => {
      EventsTable.addRow((i + 1).toString() + '.', file.split(/[\\/]/).pop(), '» 🌱 «');

      const eventPath = path.resolve(file);
      const event: ClientEvent = (await import(`${pathToFileURL(eventPath)}`)).default;

      if (event.options?.ONCE) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }

      client.clientEvents.set(event.name, event);
    });

    if (EventsDir.length === 0) EventsTable.addRow('0.', 'Missing Events', '» 🔆 «');
    if (!reloading) {
      console.log(chalk.white(EventsTable.toString()));
      setTimeout(async () => {
        logger.info('Client Events • loaded');
        client.currentStatus++;
        client.checkStatus();
      }, 1000);
    }
  }
}
