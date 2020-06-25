import { EventEmitter } from 'events';

//Setup our main emitter
class Helper extends EventEmitter {}
const _helper: Helper = new Helper();

//Main library
export const helper: Helper = _helper;
export * from './pageReaction';
export * from './roleReaction';
export * from './getArgs';
export * from './getCommand';
export * from './mentionChecks';
export * from './findRole';
export * from './findRoles';
export * from './findChannel';
export * from './findChannels';
export * from './joinVoiceChannel';
export * from './leaveVoiceChannel';
export * from './leaveAllVoiceChannels';
export * from './playYoutube';
export * from './userToMember';
export * from './muteUser';
export * from './Logger';
export * from './commandRegistry';

//Utils
export * from './utils/Queue';
export * from './utils/isID';
export * from './utils/DiscordChannel';
export * from './utils/numberID';

//Event Stuff
import { 
    Client, 
    MessageReaction, 
    User, 
    PartialUser 
} from 'discord.js';
import { pageReaction } from './pageReaction';
import { roleReaction } from './roleReaction';

let client: Client;
let reactionListenerCalled = false;

let pageReactions: Array<pageReaction> = [];
let roleReactions: Array<roleReaction> = [];

helper.on('pageReactionCreate', (reaction: pageReaction) => {
    pageReactions.push(reaction);
    if (!reactionListenerCalled) {
        //yoink the client :>)
        client = !client ? reaction.message.client : client;
        ReactionListener();
    }
})

helper.on('roleReactionCreate', (reaction: roleReaction) => {
    roleReactions.push(reaction);
    if (!reactionListenerCalled) {
        //yoink the client :>)
        client = !client ? reaction.message.client : client;
        ReactionListener();
    }
})

function ReactionListener() {
    reactionListenerCalled = true;

    client.on('messageReactionAdd', (reaction: MessageReaction, user: User | PartialUser) => {
        const castedUser:User=<User>user;
        pageReactions.forEach((preaction: pageReaction) => { preaction.updateAdd(reaction, castedUser) })
    });

    client.on('messageReactionRemove', (reaction: MessageReaction, user: User | PartialUser) => {
        const castedUser:User=<User>user;
        pageReactions.forEach((preaction: pageReaction) => { preaction.updateRemove(reaction, castedUser) })
    });
}
