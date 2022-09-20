import { SelectMenus, Buttons } from '../Interfaces/interfaces.js';
import { BaseClient } from '../Classes/client.js';
import { pathToFileURL } from 'url';
import { promisify } from 'util';

import ConsoleLogger from '../Classes/consoleLogger.js';
import glob from 'glob';
import path from 'path';

const PG = promisify(glob);
const logger = new ConsoleLogger();

export default class ComponentInteractionsHandler {
  constructor() {}

  public async loadSelectMenus(client: BaseClient, reloading?: boolean) {
    const InteractionDir = await PG(`${process.cwd()}/dist/ComponentInteractions/Menus/*/*{.ts,.js}`);
    await Promise.all(
      InteractionDir.map(async (file, i) => {
        const interactionPath = path.resolve(file);
        const interaction: SelectMenus = (await import(`${pathToFileURL(interactionPath)}`)).default;

        client.selectMenus.set(interaction.customId, interaction);
      })
    );
    if (!reloading) {
      client.currentStatus++;
      client.checkStatus();
    }
    setTimeout(() => {
      logger.info('Select menus • loaded');
    }, 500);
  }

  public async loadButtons(client: BaseClient, reloading?: boolean) {
    const InteractionDir = await PG(`${process.cwd()}/dist/ComponentInteractions/Buttons/*/*{.ts,.js}`);
    await Promise.all(
      InteractionDir.map(async (file, i) => {
        const interactionPath = path.resolve(file);
        const interaction: Buttons = (await import(`${pathToFileURL(interactionPath)}`)).default;

        client.buttons.set(interaction.customId, interaction);
      })
    );
    if (!reloading) {
      client.currentStatus++;
      client.checkStatus();
    }

    setTimeout(() => {
      logger.info('Buttons • loaded');
    }, 500);
  }
}
