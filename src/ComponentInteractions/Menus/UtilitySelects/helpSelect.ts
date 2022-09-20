import { CategoryInfos } from '../../../Structures/Interfaces/UtilityTypes/clientConfig';
import { PrefixCommand, SlashCommand } from '../../../Structures/Interfaces/interfaces';
import { SelectMenus } from '../../../Structures/Interfaces/interfaces.js';
import { icon, color } from '../../../Structures/Design/designs.js';
import { EmbedBuilder, APIEmbedField } from 'discord.js';
import { pathToFileURL } from 'url';
import { promisify } from 'util';

import glob from 'glob';
import path from 'path';

const PG = promisify(glob);

const interactionSelect: SelectMenus = {
  customId: 'helpSelection',
  allowInteractionAuthorOnly: true,
  execute: async (interaction, client) => {
    const HelpEmbed = new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`);

    const CmdsDir = await PG(`${process.cwd()}/dist/SlashCommands/${interaction.values[0].split('-').pop()}/*{.ts,.js}`);
    const PrefixCmdsDir = await PG(`${process.cwd()}/dist/PrefixCommands/${interaction.values[0].split('-').pop()}/*{.ts,.js}`);

    const helpEmbedFields: Array<APIEmbedField> = [];
    let DevCommands: number = 0;

    //Slash Commands
    await Promise.all(
      CmdsDir.map(async (file, i) => {
        const commandPath = path.resolve(file);
        const command: SlashCommand = (await import(`${pathToFileURL(commandPath)}`)).default;

        if (commandPath.split(/[\\/]/).pop()?.includes('.dev.')) return DevCommands++;
        helpEmbedFields.push({
          name: `---`,
          value: `**[${command.data.name}](https://discord.com)**\n**${icon.reply.continue.mid} Description:** ${command.data.description || 'Description not available.'}\n**${
            icon.reply.continue.end
          } Command Info:** Slash Command / ${command.options?.isPremium ? 'Premium' : 'Free'}\n\n`,
          inline: false,
        });
      })
    );

    //Prefix Commands
    await Promise.all(
      PrefixCmdsDir.map(async (file, i) => {
        const commandPath = path.resolve(file);
        const command: PrefixCommand = (await import(`${pathToFileURL(commandPath)}`)).default;

        if (commandPath.split(/[\\/]/).pop()?.includes('.dev.')) return DevCommands++;
        const optionArgs: Array<string> = [];

        if (command.options)
          await Promise.all(
            command!.options.map(async (currentOption: any, i: number) => {
              optionArgs.push(`<${currentOption.name} | ${currentOption.type}${!currentOption.required ? ' (optional)' : ''}>`);
            })
          );

        helpEmbedFields.push({
          name: `---`,
          value: `**[${command.name}](https://discord.com)**\n**${icon.reply.continue.mid} Description:** ${command.description || 'Description not available.'}\n**${
            icon.reply.continue.mid
          } Command Info:** Prefix Command / ${command.isPremium ? 'Premium' : 'Free'}\n**${icon.reply.continue.mid} Aliases:** ${
            command.aliases?.toString().replaceAll(',', ' | ') || 'Aliases not available.'
          }\n**${icon.reply.continue.end} Usage:** \`${client.config.PREFIX}${command.name} ${optionArgs.toString().replaceAll(',', ' ')}\`\n\n`,
          inline: false,
        });
      })
    );

    type owners = {
      name?: string;
      id?: string;
    };

    const owner: owners = client.config.OwnerIds![0];

    HelpEmbed.setAuthor({
      name: `${client.config.HelpCategories.find((category: CategoryInfos) => category.dirName === interaction.values[0].split('-').pop()).emoji} ${
        client.config.BOT_NAME
      }'s help page - ${interaction.values[0].split('-').pop()} category`,
    })
      .setFooter({ text: `Contact ${owner.name} for help.` })
      .addFields(helpEmbedFields);

    interaction.message.edit({ embeds: [HelpEmbed] });
    interaction.deferUpdate();
  },
};

export default interactionSelect;
