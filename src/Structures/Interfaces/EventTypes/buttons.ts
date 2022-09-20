import { PermissionsString } from 'discord.js';

export interface Buttons {
  customId: string;
  checkIfCustomIdIncludes?: boolean;
  cooldown?: number;
  isPremium?: boolean;
  permissions?: Array<PermissionsString> | PermissionsString;
  allowInteractionAuthorOnly?: boolean;
  execute: (...args: any[]) => any;
}
