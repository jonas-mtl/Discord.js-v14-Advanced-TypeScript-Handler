import { ClientEvent } from '../../Structures/Interfaces/interfaces.js';
import { color } from '../../Structures/Design/designs.js';
import { EmbedBuilder } from 'discord.js';

import DB from '../../Structures/Schemas/premiumGuildsDB.js';

const event: ClientEvent = {
  name: 'messageCreate',
  options: {
    ONCE: false,
    REST: false,
  },
  async execute(message, client) {
    if (message.author.bot) return;
    if (message.channel.type !== 0) return;
    if (!message.content.startsWith(client.config.PREFIX)) return;
    const args = message.content.slice(client.config.PREFIX.length).trim().split(/ +/g);
    const cmd: string = args.shift().toLowerCase();
    if (cmd.length == 0) return;
    let command = client.prefixCommands.get(cmd);

    if (!command) command = client.prefixCommands.get(client.prefixCommandsAlias.get(cmd)!);

    //DEV command check
    if (command?.isDevCommand && message.guild.id !== client.config.DevGuilds[0].id)
      return message.reply({
        embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> ${message.author}, this command is **only available for developers!**.`)],
      });

    if (command?.permissions && !message.member.permissions.has(command?.permissions))
      //Permission check
      return message.reply({
        embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> ${message.author}, you **don't have permissions** to use this command!.`)],
      });

    //Cooldown check
    if (command?.cooldown) {
      const currentMemberCooldown = client.cooldowns.get(`${message.author.id}-prefixCommand-${cmd}`);
      if (!currentMemberCooldown) client.cooldowns.set(`${message.author.id}-prefixCommand-${cmd}`, (Date.now() + command.cooldown).toString());
      else if (parseInt(currentMemberCooldown) < Date.now()) client.cooldowns.set(`${message.author.id}-prefixCommand-${cmd}`, (Date.now() + command.cooldown).toString());
      else
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(`#${color.Discord.BACKGROUND}`)
              .setDescription(`> ${message.author}, you are on **cooldown try again <t:${Math.floor(parseInt(currentMemberCooldown) / 1000)}:R>**.`),
          ],
        });
    }

    //Premium check
    if (command?.isPremium) {
      const PremiumGuildInfo = await DB.findOne({ GuildID: message.guild.id });
      if (PremiumGuildInfo === null)
        return message.reply({
          embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> ${message.author}, this command is only available for **premium guilds**!`)],
        });
    }

    const requiredArgs: Array<any> = [];
    const customArgs: Array<any> = [];
    const optionArgs: Array<string> = [];

    if (command?.options)
      await Promise.all(
        command!.options!.map(async (currentOption: any, i: number) => {
          if (currentOption.required === true) requiredArgs.push(currentOption);
          optionArgs.push(`<${currentOption.name} | ${currentOption.type}${!currentOption.required ? ' (optional)' : ''}>`);
        })
      );

    const userErrorMessage = new EmbedBuilder()
      .setColor(`#${color.Discord.BACKGROUND}`)
      .setDescription(`> ${message.author}, **wrong usage** of the command!\n\`\`\`${client.config.PREFIX}${cmd} ${optionArgs.toString().replaceAll(',', ' ')}\`\`\``);

    if (args.length < requiredArgs.length)
      return message.reply({
        embeds: [userErrorMessage],
      });

    let errorMessage: string = '';

    await Promise.all(
      args.map(async (currentArg: any, i: number) => {
        if (command?.options![i].type == 'number' && !/^[0-9]+$/.test(currentArg)) errorMessage = `number expected - ${typeof currentArg} recieved.`;
        else if (command?.options![i].type == 'string' && typeof currentArg !== 'string') errorMessage = `string expected - ${typeof currentArg} recieved.`;
        else if (command?.options![i].type == 'boolean' && currentArg !== 'true' && currentArg !== 'false') errorMessage = `true/false expected - ${typeof currentArg} recieved.`;

        if (command?.options![i].type == 'user' && currentArg.substring(1, 2) !== '@') errorMessage = `user expected - ${typeof currentArg} recieved.`;
        else customArgs.push(message.guild.members.cache.get(currentArg.substring(2, 20)));

        if (command?.options![i].type == 'channel' && currentArg.substring(1, 2) !== '#') errorMessage = `channel expected - ${typeof currentArg} recieved.`;
        else customArgs.push(message.guild.channels.cache.get(currentArg.substring(2, 21)));

        if (command?.options![i].type == 'role' && currentArg.substring(1, 3) !== '@&') errorMessage = `role expected - ${typeof currentArg} recieved.`;
        else customArgs.push(message.guild.roles.cache.get(currentArg.substring(2, 21)));
      })
    );
    if (errorMessage !== '') {
      message.reply({
        embeds: [userErrorMessage.setFooter({ text: `wrong argument ・ ${errorMessage}` })],
      });
    } else command?.execute(message, customArgs, client);
  },
};

export default event;
