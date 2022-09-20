import { SlashCommandBuilder } from 'discord.js';

interface CommandOptions {
  cooldown?: number;
  isPremium?: boolean;
  description?: string;
}

export interface SlashCommand {
  data: SlashCommandBuilder | any;
  options?: CommandOptions;
  execute: (...args: any[]) => any;
}
