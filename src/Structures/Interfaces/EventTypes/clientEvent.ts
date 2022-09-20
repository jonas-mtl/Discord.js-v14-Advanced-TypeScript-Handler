import { ClientEvents } from 'discord.js';

interface EventOptions {
  ONCE?: boolean;
  REST?: boolean;
}

export interface ClientEvent {
  name: keyof ClientEvents;
  options?: EventOptions;
  execute: (...args: any[]) => any;
}
