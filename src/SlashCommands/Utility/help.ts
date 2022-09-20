import { ChatInputCommandInteraction, EmbedBuilder, APIEmbedField, SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } from 'discord.js';
import { SlashCommand, CategoryInfos, PrefixCommand } from '../../Structures/Interfaces/interfaces.js';
import { icon, color } from '../../Structures/Design/designs.js';
import { BaseClient } from '../../Structures/Classes/client.js';
import { pathToFileURL } from 'url';
import { promisify } from 'util';

import glob from 'glob';
import path from 'path';

const PG = promisify(glob);

const command: SlashCommand = {
  data: new SlashCommandBuilder().setName('help').setDescription('Need some help?'),
  options: {
    cooldown: 10000,
  },
  execute: async (interaction: ChatInputCommandInteraction, client: BaseClient) => {
    const HelpEmbed = new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`);

    const CmdsDir = await PG(`${process.cwd()}/dist/SlashCommands/Utility/*{.ts,.js}`);
    const PrefixCmdsDir = await PG(`${process.cwd()}/dist/PrefixCommands/Utility/*{.ts,.js}`);

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
      name: `🎯 ${client.config.BOT_NAME}'s help page - Utility category`,
    })
      .setFooter({ text: `Contact ${owner.name} for help.` })
      .addFields(helpEmbedFields);

    const selectOptions: any = [];
    await Promise.all(
      client.config.HelpCategories.map(async (category: CategoryInfos) => {
        const newCategoryOption = {
          label: category.alias || category.dirName,
          emoji: category.emoji,
          description: category.description || `Recieve help for the ${category.alias || category.dirName} category`,
          value: `helpSelectionOption-${category.dirName}`,
        };

        selectOptions.push(newCategoryOption);
        console.log(typeof newCategoryOption, typeof selectOptions[0]);
      })
    );

    const row: any = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId('helpSelection')
        .setPlaceholder("Select a category to view it's commands")
        .addOptions(...selectOptions)
    );

    interaction.reply({ embeds: [HelpEmbed], components: [row] });
  },
};

export default command;
