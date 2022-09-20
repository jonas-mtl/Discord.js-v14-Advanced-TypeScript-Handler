import { SlashCommand } from '../../Structures/Interfaces/interfaces.js';
import { icon, color } from '../../Structures/Design/designs.js';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const command: SlashCommand = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Bot Status Information'),
  options: {
    cooldown: 10000,
  },
  execute: async (interaction, client) => {
    await interaction.reply(`> ${icon.animated.discord} Pong! Please wait...`);
    const msg = await interaction.fetchReply();
    const embed = new EmbedBuilder()
      .setColor(`#${color.Discord.BACKGROUND}`)
      .setDescription(
        `> ${
          Math.floor(msg.createdTimestamp - interaction.createdTimestamp) < 20
            ? icon.color.green
            : Math.floor(msg.createdTimestamp - interaction.createdTimestamp) < 40
            ? icon.color.orange
            : Math.floor(msg.createdTimestamp - interaction.createdTimestamp) > 40 && icon.color.red
        } **${client.config.BOT_NAME}'s current ping:** \`${Math.floor(msg.createdTimestamp - interaction.createdTimestamp)}ms\`\n---\n ${
          icon.reply.continue.start
        }  ***Discord's Gateway API ping:*** \`${client.ws.ping}ms\`\n ${icon.reply.continue.end}  ***Bot uptime:*** <t:${parseInt(`${client.readyTimestamp! / 1000}`)}:R>`
      );
    interaction.editReply({ embeds: [embed], content: `` });
  },
};

export default command;
