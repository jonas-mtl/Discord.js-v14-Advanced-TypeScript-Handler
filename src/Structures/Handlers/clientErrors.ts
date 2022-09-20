import { EmbedBuilder, WebhookClient } from 'discord.js';
import { BaseClient } from '../Classes/client.js';
import { color, icon } from '../Design/designs.js';
import { inspect } from 'util';

import ConsoleLogger from '../Classes/consoleLogger.js';

const logger = new ConsoleLogger();

export default class ClientErrorHandler {
  constructor() {}

  public async handleErrors(client: BaseClient) {
    const webhook = new WebhookClient({
      url: client.config.DEVLOG_WEBHOOK
    });

    setTimeout(async () => {
      logger.info('Error Handling • enabled');
    }, 1000);

    const embed = new EmbedBuilder();
    client.on('error', (err): any => {
      logger.error(`${err}`);

      embed
        .setTitle('Discord API Error')
        .setURL('https://discordjs.guide/popular-topics/errors.html#api-errors')
        .setColor(`#${color.All.RED}`)
        .setDescription(`\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error(`${reason}`);

      embed
        .setTitle('**Unhandled Rejection/Catch**')
        .setURL('https://nodejs.org/api/process.html#event-unhandledrejection')
        .setColor(`#${color.All.RED}`)
        .addFields(
          {
            name: `${icon.color.red} Reason`,
            value: `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\``
          },
          {
            name: 'Promise',
            value: `\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\``
          }
        )
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });

    process.on('uncaughtException', (err, origin) => {
      logger.error(`${err} \n ${origin}`);

      embed
        .setTitle('**Uncaught Exception/Catch**')
        .setColor(`#${color.All.RED}`)
        .setURL('https://nodejs.org/api/process.html#event-uncaughtexception')
        .addFields(
          {
            name: `${icon.color.red} Error`,
            value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
          },
          {
            name: 'Origin',
            value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``
          }
        )
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });

    process.on('uncaughtExceptionMonitor', (err, origin) => {
      logger.error(`${err} \n ${origin}`);

      embed
        .setTitle('**Uncaught Exception Monitor**')
        .setColor(`#${color.All.RED}`)
        .setURL('https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor')
        .addFields(
          {
            name: `${icon.color.red} Error`,
            value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
          },
          {
            name: 'Origin',
            value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``
          }
        )
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });

    process.on('warning', (warn) => {
      logger.info(`${warn}`);

      embed
        .setTitle('**Uncaught Exception Monitor Warning**')
        .setColor(`#${color.All.RED}`)
        .setURL('https://nodejs.org/api/process.html#event-warning')
        .addFields({
          name: `${icon.color.orange} Warn`,
          value: `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\``
        })
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });
  }
}
