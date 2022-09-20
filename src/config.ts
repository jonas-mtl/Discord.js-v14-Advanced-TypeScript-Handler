import { Config as InterfaceConfig } from './Structures/Interfaces/interfaces.js';

const Config: InterfaceConfig = {
  TOKEN: '',
  CLIENT_ID: '',
  DEVLOG_WEBHOOK: '',
  CLEAR_DEVLOG_ON_RESTART: true,
  PREFIX: '.',
  BOT_NAME: 'Bot',
  Database: {
    MongoDB: '',
  },
  DevGuilds: [
    {
      name: 'Support',
      id: '',
    },
  ],
  OwnerIds: [
    {
      name: 'Jonas',
      id: '783252406753689601',
    },
  ],
  AdminIds: [
    {
      name: 'Jonas',
      id: '783252406753689601',
    },
  ],
  HelpCategories: [
    {
      dirName: 'Utility',
      description: 'Utility commands',
      emoji: '🎯',
    },
    {
      dirName: 'Client',
      alias: 'Information',
      description: 'Information commands',
      emoji: '🔩',
    },
  ],
  DEVELOPMENT: true,
  ERROR_HANDLING: false,
};

export default Config;
