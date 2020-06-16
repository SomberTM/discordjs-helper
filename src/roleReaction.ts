import { EmojiIdentifierResolvable, Role, Message, GuildMember, MessageReaction, User, PartialUser, Client } from 'discord.js'

let _client: Client;
let initialized: boolean = false;
let roleReactions: roleReaction[] = [];

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
 
        roleReactions.push(this);
        
        if (!initialized) { this.secondHandInit(); }
    }

    public static init(client: Client) {
        _client = client;
        console.log(`[INFO]: Role reactions initialized`);
        listen();
        initialized = true;
    }

    public static reactions(): roleReaction[] {
      return roleReactions;
    }

    private secondHandInit() {
        _client = this.message.client;
        console.log(`[INFO]: Role reactions initialized`);
        listen();     
        initialized = true;
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

    public static help()
    {
        roleReactionHelp();
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

function listen() {
  _client.on('messageReactionAdd', (messageReaction: MessageReaction, user: User | PartialUser) => {
      if (user.bot) return;
      roleReactions.forEach((reaction: roleReaction) => {
        if (reaction.isReactedTo(messageReaction)) {
          reaction.addRole(messageReaction.message.guild!.member(<User>user)!);
        }
      })
  });

  _client.on('messageReactionRemove', (messageReaction: MessageReaction, user: User | PartialUser) => {
      if (user.bot) return;
      roleReactions.forEach((reaction: roleReaction) => {
        if (reaction.isReactedTo(messageReaction)) {
          reaction.removeRole(messageReaction.message.guild!.member(<User>user)!);
        }
      })
  }); 
}

function roleReactionHelp()
{
let help: string = 
`\nroleReaction Class Help:\n
Step 1: Storing roleReactions
  -> let roleReactions = [];
  ->
  -> /* Inside Message Event */ <client>.on('message', (message) => { 
    -> let args = getArgs(message, "!");
    -> let cmd = getCommand(args);
    ->
    -> if (cmd == 'rr-add' || cmd == 'rr-create') {
      -> if (!args[0] || !args[1] || !message.mentions.roles.first()) return; //If we dont have any of these values it wont work -> 
      ->                                                                      //args[0] will be the message id for us to react to, args[1] will be the emoji, and message.mentions.roles.first() will be the role to be added upon reaction 
      ->  
      -> let messageToReactTo = await findMessage(message.channel, args[0]);
      -> let emoji = args[1]; //Can be any emoji
      -> let role = message.mentions.roles.first(); //Assuming a role was mentioned in the message
      ->
      -> roleReactions.push(new roleReaction(messageToReactTo, emoji, role));
    -> }
  -> })
\n
Step 2: The messageReactionAdd listener
  -> <client>.on('messsageReactionAdd', (messageReaction, user) => {
    ->   roleReactions.forEach((reaction) => { //Loop through all the saved reactions from step 1
      ->     if (reaction.isReactedTo(messageReaction)) {  //Was this reaction reacted to?
        ->       reaction.addRole( messageReaction.message.guild.member(user) ); //Converts the user to a guildmember and gives them this reactions role
      ->     }  
    ->   })
  -> })
\n
Step 3: The messageReactionRemove listener
  -> <client>.on('messsageReactionRemove', (messageReaction, user) => {
    ->     roleReactions.forEach((reaction) => { //Loop through all the saved reactions from step 1
      ->       if (reaction.isReactedTo(messageReaction)) {  //Was this reaction reacted to?
        ->         reaction.removeRole( messageReaction.message.guild.member(user) ); //Converts the user to a guildmember and removes the role from the user thats tied to this reaciton
      ->       }
    ->     })
  -> })
\n
This should help you with the setup for using this roleReaction class
`
console.log(help);
}