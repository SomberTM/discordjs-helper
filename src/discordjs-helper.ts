import { Client } from 'discord.js';
import { pageReaction } from './pageReaction';

import { getArgs } from './getArgs';
import { getCommand } from './getCommand';
import { isMember, isChannel, isRole, isEveryone, isMention } from './mentionChecks';
import { findRole } from './findRole';

export function init(discordClient: Client) {
    pageReaction.init(discordClient);
}
