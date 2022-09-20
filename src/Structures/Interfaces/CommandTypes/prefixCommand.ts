import { PermissionsString } from 'discord.js';

interface CommandArgs {
  name: string;
  type: 'user' | 'role' | 'channel' | 'string' | 'number' | 'boolean' | string | number | boolean;
  required?: boolean;
}

export interface PrefixCommand {
  name: string;
  description?: string;
  aliases?: Array<string>;
  permissions?: Array<PermissionsString> | PermissionsString;
  cooldown?: number;
  isPremium?: boolean;
  isDevCommand?: boolean;
  options?: Array<CommandArgs>;
  execute: (...args: any[]) => any;
}
