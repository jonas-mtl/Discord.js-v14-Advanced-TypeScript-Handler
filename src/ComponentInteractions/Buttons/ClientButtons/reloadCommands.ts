import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Buttons } from '../../../Structures/Interfaces/interfaces.js';
import { icon, color } from '../../../Structures/Design/designs.js';
import { BaseClient } from '../../../Structures/Classes/client.js';
import { execSync } from 'child_process';

import ComponentInteractionsHandler from '../../../Structures/Handlers/componentInteractions.js';
import SlashCommandsHandler from '../../../Structures/Handlers/slashCommands.js';
import ConsoleLogger from '../../../Structures/Classes/consoleLogger.js';
import fs from 'fs';

const interactionSelect: Buttons = {
  customId: 'reloadCommands',
  allowInteractionAuthorOnly: true,
  execute: async (interaction: ChatInputCommandInteraction, client: BaseClient) => {
    await interaction.reply({ embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> ${icon.animated.discord} Please wait...`)] });

    const { loadButtons, loadSelectMenus } = new ComponentInteractionsHandler();
    const { loadSlashCommands } = new SlashCommandsHandler();
    const logger = new ConsoleLogger();

    fs.rm('dist', { recursive: true }, (err) => {
      if (err) {
        interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> ${icon.color.red} Handler **failed to load:** \`\`\`${err}\`\`\``)] });
        logger.error(`Handler failed to restart • ${err}`);
      }
    });

    try {
      execSync('tsc', { encoding: 'utf-8' });
      await loadSlashCommands(client, true);
      await loadSelectMenus(client, true);
      await loadButtons(client, true);

      interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> ${icon.color.green} Slash Commands Handler **sucessfully reloaded!**`)] });
      logger.info(`Slash Commands • reloaded`);
    } catch (err) {
      interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> ${icon.color.red} Handler **failed to load:** \`\`\`${err}\`\`\``)] });
      logger.error(`Handler failed to restart • ${err}`);
    }
  },
};

export default interactionSelect;
