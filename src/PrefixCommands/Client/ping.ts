import { PrefixCommand } from '../../Structures/Interfaces/interfaces.js';
import { icon, color } from '../../Structures/Design/designs.js';
import { EmbedBuilder } from 'discord.js';

const command: PrefixCommand = {
  name: 'ping',
  description: "Shows bot's current status",
  execute: async (message, customArgs, client) => {
    const pingMessage = await message.reply(`> ${icon.animated.discord} Pong! Please wait...`);
    const msg = await message.channel.messages.fetch(pingMessage.id);
    const embed = new EmbedBuilder()
      .setColor(`#${color.Discord.BACKGROUND}`)
      .setDescription(
        `> ${
          Math.floor(msg.createdTimestamp - message.createdTimestamp) < 20
            ? icon.color.green
            : Math.floor(msg.createdTimestamp - message.createdTimestamp) < 40
            ? icon.color.orange
            : Math.floor(msg.createdTimestamp - message.createdTimestamp) > 40 && icon.color.red
        } **${client.config.BOT_NAME}'s current ping:** \`${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms\`\n---\n ${icon.reply.continue.start}  ***Discord's Gateway API ping:*** \`${
          client.ws.ping
        }ms\`\n ${icon.reply.continue.end}  ***Bot uptime:*** <t:${parseInt(`${client.readyTimestamp! / 1000}`)}:R>`
      );
    msg.edit({ embeds: [embed], content: `` });
  },
};

export default command;
