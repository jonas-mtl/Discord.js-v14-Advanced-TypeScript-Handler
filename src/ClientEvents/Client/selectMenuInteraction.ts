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
    if (!interaction.isSelectMenu()) return;

    let menu: any;
    for (const key of client.selectMenus.keys()) {
      if (interaction.customId.includes(key)) {
        let checkMenu = client.selectMenus.get(key);
        if (!checkMenu.checkIfCIDIncludes && key !== interaction.customId) {
          return;
        } else {
          menu = checkMenu;
        }
      }
    }

    if (!menu) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> This menu is **outdated**, please try again.`)],
        ephemeral: true,
      });
    }

    if (menu.allowInteractionAuthorOnly && interaction.user.id !== interaction.message.interaction.user.id)
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> You are **not allowed** to use this selection.`)],
        ephemeral: true,
      });
    if (menu.cooldown) {
      //Cooldown check
      const currentMemberCooldown = client.cooldowns.get(`${interaction.user.id}-button-${interaction.customId}`);
      if (!currentMemberCooldown) client.cooldowns.set(`${interaction.user.id}-button-${interaction.customId}`, (Date.now() + menu.cooldown).toString());
      else if (parseInt(currentMemberCooldown) < Date.now()) client.cooldowns.set(`${interaction.user.id}-button-${interaction.customId}`, (Date.now() + menu.cooldown).toString());
      else
        return interaction.reply({
          embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> You are on **cooldown try again <t:${Math.floor(parseInt(currentMemberCooldown) / 1000)}:R>**.`)],
          ephemeral: true,
        });
    }

    //Premium check
    if (menu.isPremium) {
      const PremiumGuildInfo = await DB.findOne({ GuildID: interaction.guildId });
      if (PremiumGuildInfo === null)
        return interaction.reply({
          embeds: [new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`).setDescription(`> This menu is only available for **premium guilds**!`)],
          ephemeral: true,
        });
    }

    menu.execute(interaction, client);
  },
};

export default event;
