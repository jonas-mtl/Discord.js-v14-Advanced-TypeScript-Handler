import { ClientEvent } from '../../Structures/Interfaces/interfaces.js';
import { color } from '../../Structures/Design/designs.js';
import { EmbedBuilder } from 'discord.js';

import DB from '../../Structures/Schemas/premiumGuildsDB.js';

const event: ClientEvent = {
  name: 'interactionCreate',
  options: {
    ONCE: false,
    REST: false,
  },
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> This command is **outdated**, please try again.`)],
        ephemeral: true,
      });
    }

    //Cooldown check
    if (command.options?.cooldown) {
      const currentMemberCooldown = client.cooldowns.get(`${interaction.user.id}-button-${interaction.commandName}`);
      if (!currentMemberCooldown) client.cooldowns.set(`${interaction.user.id}-button-${interaction.commandName}`, (Date.now() + command.options.cooldown).toString());
      else if (parseInt(currentMemberCooldown) < Date.now()) client.cooldowns.set(`${interaction.user.id}-button-${interaction.commandName}`, (Date.now() + command.options.cooldown).toString());
      else
        return interaction.reply({
          embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> You are on **cooldown try again <t:${Math.floor(parseInt(currentMemberCooldown) / 1000)}:R>**.`)],
          ephemeral: true,
        });
    }

    //Premium check
    if (command.options?.isPremium) {
      const PremiumGuildInfo = await DB.findOne({ GuildID: interaction.guildId });
      if (PremiumGuildInfo === null)
        return interaction.reply({
          embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> This command is only available for **premium guilds**!`)],
          ephemeral: true,
        });
    }

    command.execute(interaction, client);
  },
};

export default event;
