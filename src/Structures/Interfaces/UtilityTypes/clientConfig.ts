export interface CategoryInfos {
  dirName: string;
  alias?: string;
  emoji: string;
  description: string;
}

export interface Config {
  TOKEN: string;
  CLIENT_ID: string;
  DEVLOG_WEBHOOK: string;
  BOT_NAME: string;
  CLEAR_DEVLOG_ON_RESTART: boolean;
  PREFIX: string;
  Database: {
    MongoDB: string;
    Redis?: string;
  };
  OwnerIds?: object[];
  AdminIds?: object[];
  Webhooks?: object[];
  DevGuilds: [
    {
      name: string;
      id: string;
    }
  ];
  APIs?: [
    {
      name: string;
      apiKey: string;
    }
  ];
  HelpCategories: CategoryInfos[];
  DEVELOPMENT: boolean;
  ERROR_HANDLING: boolean;
}
