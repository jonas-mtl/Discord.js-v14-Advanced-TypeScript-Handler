import { SlashCommand, PrefixCommand, Config, ClientEvent, SelectMenus, Buttons } from '../Interfaces/interfaces.js';
import { Client, Collection, GatewayIntentBits, Partials, version } from 'discord.js';

import ComponentInteractionsHandler from '../Handlers/componentInteractions.js';
import PrefixCommandsHandler from '../Handlers/prefixCommands.js';
import SlashCommandsHandler from '../Handlers/slashCommands.js';
import ClientEventsHandler from '../Handlers/clientEvents.js';
import ClientErrorHandler from '../Handlers/clientErrors.js';

import ConsoleLogger from './consoleLogger.js';
import clientConfig from '../../config.js';
import mongoose from 'mongoose';

const { Guilds, GuildMembers, GuildMessages, GuildPresences, GuildMessageReactions, DirectMessages, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel, Reaction } = Partials;

const logger = new ConsoleLogger();

export class BaseClient extends Client {
  public slashCommands: Collection<string, SlashCommand>;
  public prefixCommands: Collection<string, PrefixCommand>;
  public clientEvents: Collection<string, ClientEvent>;
  public selectMenus: Collection<string, SelectMenus>;
  public buttons: Collection<string, Buttons>;

  public prefixCommandsAlias: Collection<string, string>;
  public cooldowns: Collection<string, string>;

  public config: Config;
  public currentStatus: number;

  constructor() {
    super({
      intents: [Guilds, GuildMembers, GuildMessages, GuildPresences, GuildMessageReactions, MessageContent, DirectMessages],
      partials: [User, Message, GuildMember, ThreadMember, Channel, Reaction]
    });

    this.slashCommands = new Collection();
    this.prefixCommands = new Collection();
    this.prefixCommandsAlias = new Collection();

    this.cooldowns = new Collection();
    this.clientEvents = new Collection();
    this.selectMenus = new Collection();
    this.buttons = new Collection();

    this.currentStatus = 0;
    this.config = clientConfig;
  }

  public async start() {
    // Modules
    await this.registerModules();

    // Database
    await this.connectMongoDB();

    //Login
    await this.login(this.config.TOKEN);
  }

  private async registerModules() {
    const { loadButtons, loadSelectMenus } = new ComponentInteractionsHandler();
    const { loadPrefixCommands } = new PrefixCommandsHandler();
    const { loadEvents } = new ClientEventsHandler();
    const { loadSlashCommands } = new SlashCommandsHandler();
    const { handleErrors } = new ClientErrorHandler();

    try {
      await loadEvents(this);
      await loadButtons(this);
      await loadSelectMenus(this);
      await loadPrefixCommands(this);
      await loadSlashCommands(this);
    } catch (err) {
      logger.error(`Handler failed to load • ${err}`);
    }

    if (this.config.ERROR_HANDLING) {
      try {
        await handleErrors(this);
      } catch (err) {
        logger.error(`Error Handler • ${err}`);
      }
    } else if (!this.config.ERROR_HANDLING) logger.info('Error Handling • disabled');
  }

  private async connectMongoDB() {
    try {
      await mongoose.connect(`${this.config.Database?.MongoDB}`);
      logger.info('Mongo Database • connected');

      this.currentStatus++;
      this.checkStatus();
    } catch (err) {
      logger.error(`Mongo Database • ${err}`);
    }
  }

  public checkStatus(): void {
    if (this.currentStatus > 5) {
      console.log('---');
      logger.success(`Client • ready to use (v.${version})\n---`);
    }
  }
}
