import { ClientEvent } from '../../Structures/Interfaces/interfaces.js';
import { ActivityType } from 'discord.js';
import axios from 'axios';

const { Playing } = ActivityType;

const event: ClientEvent = {
  name: 'ready',
  options: {
    ONCE: true,
  },

  execute: async (client) => {
    client.user?.setPresence({
      activities: [
        {
          name: `Discord.js V14`,
          type: Playing,
        },
      ],
      status: 'online',
    });

    if (client.config.CLEAR_DEVLOG_ON_RESTART) {
      await axios.get(client.config.DEVLOG_WEBHOOK).then((response) => {
        const DevGuild = client.guilds.cache.get(client.config.DevGuilds[0].id);
        DevGuild.channels.cache.get(response.data.channel_id).bulkDelete(100, true);
      });
    }
  },
};

export default event;
