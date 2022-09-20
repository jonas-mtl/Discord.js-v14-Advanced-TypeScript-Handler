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
    if (!interaction.isButton()) return;

    let button: any;
    for (const key of client.buttons.keys()) {
      if (interaction.customId.includes(key)) {
        let checkButton = client.buttons.get(key);
        if (!checkButton.checkIfCIDIncludes && key !== interaction.customId) {
          return;
        } else {
          button = checkButton;
        }
      }
    }

    if (!button) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> This button is **outdated**, please try again.`)],
        ephemeral: true,
      });
    }

    if (button.allowInteractionAuthorOnly && interaction.user.id !== interaction.message.interaction.user.id)
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> You are **not allowed** to use this button.`)],
        ephemeral: true,
      });
    if (button.cooldown) {
      //Cooldown check
      const currentMemberCooldown = client.cooldowns.get(`${interaction.user.id}-button-${interaction.customId}`);
      if (!currentMemberCooldown) client.cooldowns.set(`${interaction.user.id}-button-${interaction.customId}`, (Date.now() + button.cooldown).toString());
      else if (parseInt(currentMemberCooldown) < Date.now()) client.cooldowns.set(`${interaction.user.id}-button-${interaction.customId}`, (Date.now() + button.cooldown).toString());
      else
        return interaction.reply({
          embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`>  You are on **cooldown try again <t:${Math.floor(parseInt(currentMemberCooldown) / 1000)}:R>**.`)],
          ephemeral: true,
        });
    }

    //Premium check
    if (button.isPremium) {
      const PremiumGuildInfo = await DB.findOne({ GuildID: interaction.guildId });
      if (PremiumGuildInfo === null)
        return interaction.reply({
          embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> This button is only available for **premium guilds**!`)],
          ephemeral: true,
        });
    }

    button.execute(interaction, client);
  },
};

export default event;
