import { PermissionsString } from 'discord.js';

export interface SelectMenus {
  customId: string;
  cooldown?: number;
  isPremium?: boolean;
  allowInteractionAuthorOnly?: boolean;
  permissions?: Array<PermissionsString> | PermissionsString;
  checkIfCIDIncludes?: boolean; //Checks if Interaction ID includes the entered Custom ID (CID)
  execute: (...args: any[]) => any;
}
