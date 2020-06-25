//Main library Exports
export * from './pageReaction';
export * from './roleReaction';
export * from './getArgs';
export * from './getCommand';
export * from './mentionChecks';
export * from './findRole';
export * from './findRoles';
export * from './findMessage'
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

//Utils Exports
export * from './utils/Queue';
export * from './utils/isID';
export * from './utils/DiscordChannel';
export * from './utils/numberID';

//Emitter Stuff
import { EventEmitter } from 'events';

class Helper extends EventEmitter {}
const _helper: Helper = new Helper();
export const events: Helper = _helper;

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

events.on('pageReactionCreate', (reaction: pageReaction) => {
    pageReactions.push(reaction);
    if (!reactionListenerCalled) {
        //yoink the client :>)
        client = !client ? reaction.message.client : client;
        ReactionListener();
    }
})

events.on('roleReactionCreate', (reaction: roleReaction) => {
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
        roleReactions.forEach((rreaction: roleReaction) => { if (rreaction.isReactedTo(reaction)) { rreaction.addRole(reaction.message.guild!.member(castedUser)!) } })
    });

    client.on('messageReactionRemove', (reaction: MessageReaction, user: User | PartialUser) => {
        const castedUser:User=<User>user;
        pageReactions.forEach((preaction: pageReaction) => { preaction.updateRemove(reaction, castedUser) })
        roleReactions.forEach((rreaction: roleReaction) => { if (rreaction.isReactedTo(reaction)) { rreaction.removeRole(reaction.message.guild!.member(castedUser)!) } })
    });
}
