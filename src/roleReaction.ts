import { EmojiIdentifierResolvable, Role, Message, GuildMember, MessageReaction, User, PartialUser, Client } from 'discord.js'
import { events } from './index'; 

/** CLASS : roleReaction
 * 
 * @constructor 
 *   @param { Message } messageToReactTo The Discord Message object you wish to react to. Can be found by using the findMessage(channel, id) function
 *   @param { EmojiIdentifierResolvable } emojiReaction The emoji tied to the reaction
 *   @param { Role } roleReactor The role to add or remove when the message is reacted to
 *   @param { roleReactionOptions } options Type { use_listener: boolean } | Set this to false if you want to use do the event listening yourself i.e. manually update the roles and keep track of role reactions
 * 
 * @method addRole
 *   @param { GuildMember } member The member to add the role to | (The role added is the one provided to the constructor when making this roleReaction)
 *   Since the messageReactionAdd and messageReactionRemove listeners have a User object as their callback you can use guild.member(user) or userToMember(guild, user) to convert the user to a GuildMember 
 * 
 * @method removeRole
 *   @param { GuildMember } member The member to remove the role from | (The role added is the one provided to the constructor when making this roleReaction)
 *   Since the messageReactionAdd and messageReactionRemove listeners have a User object as their callback you can use guild.member(user) or userToMember(guild, user) to convert the user to a GuildMember
 * 
 * @method isReactedTo
 *   @param { MessageReaction } messageReaction The Discord.js MessageReaction object provided by the 'messageReactionAdd' and 'messageReactionRemove' listeners
 * 
 * @method help
 *   @description Prints to the console how to use this class with discord.js's listeners and how to store the roleReactionss
 * 
 * @field { GuildMember[] } reacted | Those who are currently reacted to this roleReaction
 * @field { EmojiIdentifierResolvable } emoji | The emoji tied to this roleReaction
 * @field { Message } message | The message that users react to for this roleReaction
 * @field { Role } role | The role given to users when they react to the message for this roleReaction
 * 
 */


export class roleReaction
{
    public readonly reacted: GuildMember[];
    public readonly emoji: EmojiIdentifierResolvable
    public readonly message: Message
    public readonly role: Role

    /**
     * @constructor 
     *   @param { Message } messageToReactTo The Discord Message object you wish to react to. Can be found by using the findMessage(channel, id) function
     *   @type Discord.Message
     * 
     *   @param { EmojiIdentifierResolvable } emojiReaction The emoji tied to the reaction
     *   @type Discord.EmojiIdentifierResolvable
     * 
     *   @param { Role } roleReactor The role to add or remove when the message is reacted to
     *   @type Discord.Role
     * 
     */
    constructor(messageToReactTo: Message, emojiReaction: EmojiIdentifierResolvable, roleReactor: Role)
    {
        this.message = messageToReactTo;
        this.emoji = emojiReaction.toString();
        this.role = roleReactor;

        this.reacted = [];

        this.message.react(this.emoji);
 
        events.emit('roleReactionCreate', this);
    }

    public addRole(member: GuildMember)
    {
        if (member.user.bot) return;
        this.reacted.push(member);
        member.roles.add(this.role);
    }

    public removeRole(member: GuildMember)
    {
        if (member.user.bot) return;
        this._reamove_reactor(member);
        member.roles.remove(this.role);
    }

    public isReactedTo(messageReaction: MessageReaction)
    {
        //console.log(`mr id: ${messageReaction.message.id} emoji: ${messageReaction.emoji.toString()}, rr id: ${this.message.id} emoji: ${this.emoji}\n${messageReaction.message.id == this.message.id}, ${this.emoji == messageReaction.emoji.toString()}`)
        return (messageReaction.message.id == this.message.id && this.emoji == messageReaction.emoji.toString())
    }

    private _reamove_reactor(member: GuildMember)
    {
        for (let i = 0; i < this.reacted.length; i++) { if (this.reacted[i] == member) { this.reacted.splice(i, 1); }}
    }
    
    get reactedUsers(): GuildMember[]
    {
      return this.reacted;
    }

    get reactionEmoji(): EmojiIdentifierResolvable
    {
      return this.emoji
    }

    get reactedMessage(): Message
    {
      return this.message;
    }

    get reactionRole(): Role
    {
      return this.role;
    }

}