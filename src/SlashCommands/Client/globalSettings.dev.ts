import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { TimestampGenerator } from '../../Structures/Classes/timestampGenerator.js';
import { SlashCommand } from '../../Structures/Interfaces/interfaces.js';
import { icon, color } from '../../Structures/Design/designs.js';

import DB from '../../Structures/Schemas/premiumGuildsDB.js';

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('global-settings')
    .setDescription('Global bot settings (DEV ONLY)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommandGroup((group) =>
      group
        .setName('premium-guild')
        .setDescription('Moderate premium guilds')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('add')
            .setDescription('Add premium access to a guild')
            .addStringOption((option) => option.setName('guild-id').setDescription('ID of the guild to add premium access').setRequired(true))
            .addStringOption((option) => option.setName('premium-duration').setDescription('Duration of the premium access (e.g. 30d / 1 m / 25min / 1year)').setRequired(true))
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('remove')
            .setDescription('Remove premium access of a guild')
            .addStringOption((option) => option.setName('guild-id').setDescription('ID of the guild to remove premium access').setRequired(true))
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('info')
            .setDescription('Get premium information of a guild')
            .addStringOption((option) => option.setName('guild-id').setDescription('ID of the guild to get information').setRequired(true))
        )
    ),

  execute: async (interaction, client) => {
    const { options, guild } = interaction;
    const existingPremium = await DB.findOne({ GuildID: options.getString('guild-id') });

    type owners = {
      name?: string;
      id?: string;
    };

    const owner: owners = client.config.OwnerIds![0];
    if (interaction.user.id !== owner!.id)
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> ${icon.color.red} You are **not allowed** to use this command!`)],
        ephemeral: true,
      });
    if (client.guilds.cache.get(options.getString('guild-id') || '') === undefined)
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> ${icon.color.red} There is no guild with the ID **${options.getString('guild-id')}**!`)],
        ephemeral: true,
      });

    switch (options.getSubcommand()) {
      case 'add': {
        const timestampGen = new TimestampGenerator();
        const timestampPremiumEnd = timestampGen.timeToDate(options.getString('premium-duration')!);
        if (timestampPremiumEnd === 0)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(`#${color.Discord.BACKGROUND}`)
                .setDescription(`> ${icon.color.red} Invalid time format. Please use this format:\n\`\`\`\n"3 d" / "3min" / "3 minutes" / "4d" / "8 s"\`\`\``),
            ],
            ephemeral: true,
          });

        if (existingPremium) {
          await existingPremium
            .updateOne({
              PremiumEnd: timestampPremiumEnd,
            })
            .catch((err) => {
              return interaction.reply({
                embeds: [
                  new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> ${icon.color.red} There was an **error updating the guild in the database**!\n\`\`\`\n${err}\`\`\``),
                ],
                ephemeral: true,
              });
            });

          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(`#${color.Discord.BACKGROUND}`)
                .setDescription(
                  `> ${icon.color.green} Successfully updated **premium status** of guild \`${options.getString('guild-id')}\`.\n---\n${icon.reply.default} ***Expires at***: <t:${Math.floor(
                    timestampPremiumEnd / 1000
                  )}>`
                ),
            ],
            ephemeral: true,
          });
        } else {
          await DB.create({
            GuildID: options.getString('guild-id'),
            PremiumStart: Date.now(),
            PremiumEnd: timestampPremiumEnd,
          }).catch((err) => {
            return interaction.reply({
              embeds: [
                new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> ${icon.color.red} There was an **error adding the guild to the database**!\n\`\`\`\n${err}\`\`\``),
              ],
              ephemeral: true,
            });
          });

          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(`#${color.Discord.BACKGROUND}`)
                .setDescription(
                  `> ${icon.color.green} Successfully added **premium status** to guild \`${options.getString('guild-id')}\`.\n---\n${icon.reply.default} ***Expires at***: <t:${Math.floor(
                    timestampPremiumEnd / 1000
                  )}>`
                ),
            ],
            ephemeral: true,
          });
        }
        break;
      }
      case 'remove': {
        if (!existingPremium)
          return interaction.reply({
            embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> ${icon.color.red} The guild \`${options.getString('guild-id')}\` has no premium status to delete.`)],
            ephemeral: true,
          });

        await existingPremium.deleteOne();
        interaction.reply({
          embeds: [
            new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> ${icon.color.green} Successfully deleted premium status of guild \`${options.getString('guild-id')}\`.`),
          ],
          ephemeral: true,
        });
        break;
      }
      case 'info': {
        if (!existingPremium)
          return interaction.reply({
            embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> ${icon.color.red} The guild \`${options.getString('guild-id')}\` has no premium status.`)],
            ephemeral: true,
          });

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(`#${color.Discord.BACKGROUND}`)
              .setDescription(
                `> ${icon.color.green} The current **Premium Status** of guild \`${options.getString('guild-id')}\`.\n---\n${icon.reply.continue.start} ***Premium For***: *${
                  Math.floor((parseInt(existingPremium.PremiumEnd!) - Date.now()) / 3600000) < 20
                    ? `${Math.ceil((parseInt(existingPremium.PremiumEnd!) - Date.now()) / 3600000)} hour(s)`
                    : `${Math.ceil((parseInt(existingPremium.PremiumEnd!) - Date.now()) / 86000000)} day(s)`
                }*\n${icon.reply.continue.mid} ***Expires in***: <t:${Math.floor(parseInt(existingPremium.PremiumEnd!) / 1000)}:R>\n${icon.reply.continue.end} ***Expires at***: <t:${Math.floor(
                  parseInt(existingPremium.PremiumEnd!) / 1000
                )}>`
              ),
          ],
          ephemeral: true,
        });
        break;
      }
    }
  },
};

export default command;
