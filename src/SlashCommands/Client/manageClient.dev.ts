import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { SlashCommand } from '../../Structures/Interfaces/interfaces.js';
import { icon, color } from '../../Structures/Design/designs.js';

const command: SlashCommand = {
  data: new SlashCommandBuilder().setName('manage-client').setDescription('reload / restart').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction, client) => {
    const embed = new EmbedBuilder()
      .setColor(`#${color.Discord.BACKGROUND}`)
      .setDescription(
        `${icon.color.yellow} To reload slash commands / events or restart the client **use the buttons on this message.**\n---\n> ${icon.reply.continue.end} ***Bot uptime:*** <t:${parseInt(
          `${client.readyTimestamp! / 1000}`
        )}:R>`
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('reloadCommands').setLabel('reload commands').setStyle(ButtonStyle.Secondary).setEmoji('🔐'),
      new ButtonBuilder().setCustomId('reloadEvents').setLabel('reload events').setStyle(ButtonStyle.Secondary).setEmoji('🔐')
    );
    interaction.reply({ embeds: [embed], components: [row] });
  },
};

export default command;
