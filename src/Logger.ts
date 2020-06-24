import { DiscordChannel } from './utils/DiscordChannel'
import { findMembersRolesDiffernces } from './findMembersRolesDifferences';
import { 
    GuildChannel, 
    DMChannel, 
    MessageEmbed, 
    TextChannel, 
    GuildEmoji, 
    User, 
    Guild, 
    GuildMember, 
    Collection, 
    Snowflake, 
    Speaking, 
    Role, 
    Invite, 
    Message, 
    MessageReaction, 
    Presence, 
    Activity, 
    Client, 
    Channel,
    VoiceState,
    PartialUser,
    PartialGuildMember,
    PartialMessage,
    RateLimitData,
    PartialDMChannel
} from 'discord.js';

export type LoggerOptions = {
    log_console?: boolean,
    channels?: TextChannel[] | undefined,
    colors?: LoggerColors,
    use_callbacks?: boolean,
    blacklisted_events?: BlacklistedEvents
};

export type LoggerColors = {
    info?: string,
    update?: string,
    kick?: string,
    ban?: string,
    join?: string,
    leave?: string,
    delete?: string,
    create?: string,
    add?: string,
    remove?: string,
    default?: string
}

export type BlacklistedEvents = {
    channelCreate?: boolean,
    channelDelete?: boolean,
    channelPinsUpdate?: boolean,
    channelUpdate?: boolean,
    debug?: boolean,
    emojiCreate?: boolean,
    emojiDelete?: boolean,
    emojiUpdate?: boolean,
    error?: boolean,
    guildBanAdd?: boolean,
    guildBanRemove?: boolean,
    guildCreate?: boolean,
    guildDelete?: boolean,
    guildIntegrationsUpdate?: boolean,
    guildMemberAdd?: boolean,
    guildMemberRemove?: boolean,
    guildMembersChunk?: boolean,
    guildMemberSpeaking?: boolean,
    guildMemberUpdate?: boolean,
    guildUnavailable?: boolean,
    guildUpdate?: boolean,
    invalidated?: boolean,
    inviteCreate?: boolean,
    inviteDelete?: boolean,
    message?: boolean,
    messageDelete?: boolean,
    messageDeleteBulk?: boolean,
    messageReactionAdd?: boolean,
    messageReactionRemove?: boolean,
    messageReactionRemoveAll?: boolean,
    messageReactionRemoveEmoji?: boolean,
    messageUpdate?: boolean,
    presenceUpdate?: boolean,
    rateLimit?: boolean,
    ready?: boolean,
    roleCreate?: boolean,
    roleDelete?: boolean,
    roleUpdate?: boolean,
    shardDisconnect?: boolean,
    shardError?: boolean,
    shardReady?: boolean,
    shardReconnecting?: boolean,
    shardResume?: boolean,
    typingStart?: boolean,
    userUpdate?: boolean,
    voiceStateUpdate?: boolean,
    warn?: boolean,
    webhookUpdate?: boolean
}

type ColorResolvable = {
    INFO: string,
    UPDATE: string, 
    KICK: string,
    BAN: string,
    JOIN: string,
    LEAVE: string,
    DELETE: string,
    CREATE: string,
    ADD: string
    REMOVE: string
}

export const ColorResolvables: ColorResolvable = {
    INFO: 'info',
    UPDATE: 'update',
    KICK: 'kick',
    BAN: 'ban',
    JOIN: 'join',
    LEAVE: 'leave',
    DELETE: 'delete',
    CREATE: 'create',
    ADD: 'add',
    REMOVE: 'remove'
}

/**
 * Just a type for the structure rateLimit info
 */
type rateLimitInfo = {
    timeout: number,
    limit: number,
    method: string,
    path: string,
    route: string
}

const hexExp: RegExp = /[0-9a-fA-f]{6}/;

export class Logger {

    private options: LoggerOptions;
    private ColorResolvables: ColorResolvable;

    constructor(options?: LoggerOptions)
    {
        
        this.options = (options || options != undefined) ? options : { 
            log_console: false, 
            use_callbacks: false,
            channels: undefined, 
            colors: { default: '23272A' }, 
            blacklisted_events: Logger.defaultBlacklistedEvents() 
        };

        if (!this.options.colors)  { this.options.colors = {}; }
        if (!this.options.colors.default) { this.options.colors.default = '23272A'; }
        if (!this.options.channels) { this.options.channels = undefined; }
        if (!this.options.blacklisted_events) { this.options.blacklisted_events = Logger.defaultBlacklistedEvents(); }
        
        this.ColorResolvables = ColorResolvables;

    }

    public getLoggerOptions(): LoggerOptions { return this.options; }
    public setLoggerOptions(new_options: LoggerOptions) { this.options = new_options; }

    public getLoggerColors(): LoggerColors { return this.options!.colors!; }
    public setLoggerColors(new_colors: LoggerColors) { this.options.colors = new_colors; }

    
    public getLogChannels(): TextChannel[] | undefined { return this.options.channels != undefined ? this.options.channels : undefined }
    public setLogChannels(new_channels: TextChannel[]) { this.options.channels = new_channels }
    public addLogChannel(new_channel: TextChannel) { this.options.channels = this.options.channels == undefined ? [] : this.options.channels;  this.options.channels?.push(new_channel); }  
    public getLoggingChannel(guild_or_channel_id: string): TextChannel | undefined {  
        let channel: TextChannel | undefined = this._findLoggingChannel(guild_or_channel_id);
        if (channel || channel != undefined) {
            return channel;
        } else {
            this.options.channels?.forEach((logChannel: DiscordChannel) => {
                if (guild_or_channel_id == logChannel.id) {
                    return channel;
                }
            })
        }
        return undefined;
    }

    public static defaultBlacklistedEvents(): BlacklistedEvents { 
        return {
            channelCreate: false,
            channelDelete: false,
            channelPinsUpdate: true,
            channelUpdate: false,
            debug: true,
            emojiCreate: false,
            emojiDelete: false,
            emojiUpdate: false,
            error: true,
            guildBanAdd: false,
            guildBanRemove: false,
            guildCreate: false,
            guildDelete: false,
            guildIntegrationsUpdate: true,
            guildMemberAdd: false,
            guildMemberRemove: false,
            guildMembersChunk: false,
            guildMemberSpeaking: true,
            guildMemberUpdate: false,
            guildUnavailable: true,
            guildUpdate: false,
            invalidated: true,
            inviteCreate: false,
            inviteDelete: false,
            message: true,
            messageDelete: false,
            messageDeleteBulk: false,
            messageReactionAdd: false,
            messageReactionRemove: false,
            messageReactionRemoveAll: false,
            messageReactionRemoveEmoji: false,
            messageUpdate: false,
            presenceUpdate: false,
            rateLimit: true,
            ready: true,
            roleCreate: false,
            roleDelete: false,
            roleUpdate: false,
            shardDisconnect: true,
            shardError: true,
            shardReady: true,
            shardReconnecting: true,
            shardResume: true,
            typingStart: true,
            userUpdate: false,
            voiceStateUpdate: false,
            warn: true,
            webhookUpdate: true
        }
    }

    public static allEventsBlacklisted(): BlacklistedEvents {
        return Logger.allBlacklistedEvents();
    }

    //Incase you only want to listen to a few events you can call this and set some to false
    public static allBlacklistedEvents(): BlacklistedEvents {
        return {
            channelCreate: true,
            channelDelete: true,
            channelPinsUpdate: true,
            channelUpdate: true,
            debug: true,
            emojiCreate: true,
            emojiDelete: true,
            emojiUpdate: true,
            error: true,
            guildBanAdd: true,
            guildBanRemove: true,
            guildCreate: true,
            guildDelete: true,
            guildIntegrationsUpdate: true,
            guildMemberAdd: true,
            guildMemberRemove: true,
            guildMembersChunk: true,
            guildMemberSpeaking: true,
            guildMemberUpdate: true,
            guildUnavailable: true,
            guildUpdate: true,
            invalidated: true,
            inviteCreate: true,
            inviteDelete: true,
            message: true,
            messageDelete: true,
            messageDeleteBulk: true,
            messageReactionAdd: true,
            messageReactionRemove: true,
            messageReactionRemoveAll: true,
            messageReactionRemoveEmoji: true,
            messageUpdate: true,
            presenceUpdate: true,
            rateLimit: true,
            ready: true,
            roleCreate: true,
            roleDelete: true,
            roleUpdate: true,
            shardDisconnect: true,
            shardError: true,
            shardReady: true,
            shardReconnecting: true,
            shardResume: true,
            typingStart: true,
            userUpdate: true,
            voiceStateUpdate: true,
            warn: true,
            webhookUpdate: true
        }
    }

    public static noBlacklistedEvents(): BlacklistedEvents {
        return {
            channelCreate: false,
            channelDelete: false,
            channelPinsUpdate: false,
            channelUpdate: false,
            debug: false,
            emojiCreate: false,
            emojiDelete: false,
            emojiUpdate: false,
            error: false,
            guildBanAdd: false,
            guildBanRemove: false,
            guildCreate: false,
            guildDelete: false,
            guildIntegrationsUpdate: false,
            guildMemberAdd: false,
            guildMemberRemove: false,
            guildMembersChunk: false,
            guildMemberSpeaking: false,
            guildMemberUpdate: false,
            guildUnavailable: false,
            guildUpdate: false,
            invalidated: false,
            inviteCreate: false,
            inviteDelete: false,
            message: false,
            messageDelete: false,
            messageDeleteBulk: false,
            messageReactionAdd: false,
            messageReactionRemove: false,
            messageReactionRemoveAll: false,
            messageReactionRemoveEmoji: false,
            messageUpdate: false,
            presenceUpdate: false,
            rateLimit: false,
            ready: false,
            roleCreate: false,
            roleDelete: false,
            roleUpdate: false,
            shardDisconnect: false,
            shardError: false,
            shardReady: false,
            shardReconnecting: false,
            shardResume: false,
            typingStart: false,
            userUpdate: false,
            voiceStateUpdate: false,
            warn: false,
            webhookUpdate: false
        }
    }

    // Info / Update
    public /*set*/ infoColor(color: string)   { if (this._hexError(color)) return; this.options.colors!.info = color;   }
    public /*set*/ updateColor(color: string) { if (this._hexError(color)) return; this.options.colors!.update = color; }
    // Kick / Ban
    public /*set*/ kickColor(color: string)   { if (this._hexError(color)) return; this.options.colors!.kick = color;   }
    public /*set*/ banColor(color: string)    { if (this._hexError(color)) return; this.options.colors!.ban = color;    }  
    // Join / Leave
    public /*set*/ joinColor(color: string)   { if (this._hexError(color)) return; this.options.colors!.join = color; } 
    public /*set*/ leaveColor(color: string)  { if (this._hexError(color)) return; this.options.colors!.leave = color;  }
    // Delete / Create
    public /*set*/ deleteColor(color: string) { if (this._hexError(color)) return; this.options.colors!.delete = color; } 
    public /*set*/ createColor(color: string) { if (this._hexError(color)) return; this.options.colors!.create = color; }
    // Add / Remove
    public /*set*/ addColor(color: string)    { if (this._hexError(color)) return; this.options.colors!.add = color;    }
    public /*set*/ removeColor(color: string) { if (this._hexError(color)) return; this.options.colors!.remove = color; }

    public listen(client: Client) {
        if (this._LoggingConsole()) {
            console.log(`[INFO]: Logger is listening on client events`);
        }

        client.on('channelCreate', (channel: Channel) => {
            this.channelCreate(<GuildChannel | DMChannel>channel);
        })
        
        client.on('channelDelete', (channel: Channel) => {
            this.channelDelete(<GuildChannel | DMChannel>channel);
        })
        
        client.on('channelPinsUpdate', (channel: Channel, time: Date) => {
            this.channelPinsUpdate(<GuildChannel | DMChannel>channel, time);
        })
        
        client.on('channelUpdate', (oldChannel: Channel, newChannel: Channel) => {
            this.channelUpdate(<GuildChannel | DMChannel>oldChannel, <GuildChannel | DMChannel>newChannel);
        })
        
        client.on('debug', (info: string) => {
            this.debug(info);
        })
        
        client.on('emojiCreate', (emoji: GuildEmoji) => {
            this.emojiCreate(emoji);
        })
        
        client.on('emojiDelete', (emoji: GuildEmoji) => {
            this.emojiDelete(emoji);
        })
        
        client.on('emojiUpdate', (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => {
            this.emojiUpdate(oldEmoji, newEmoji);
        })
        
        client.on('error', (error: Error) => {
            this.error(error);
        })
        
        client.on('guildBanAdd', (guild: Guild, user: User | PartialUser) => {
            this.guildBanAdd(guild, <User>user);
        })
        
        client.on('guildMembersChunk', (members: Collection<string, GuildMember | PartialGuildMember>, guild: Guild) => {
            this.guildMembersChunk(<Collection<string, GuildMember>>members, guild);
        })
        
        client.on('guildMemberSpeaking', (member: GuildMember | PartialGuildMember, speaking: Readonly<Speaking>) => {
            this.guildMemberSpeaking(<GuildMember>member, <Speaking>speaking);
        }) 
        
        client.on('guildMemberUpdate', (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) => {
            this.guildMemberUpdate(<GuildMember>oldMember, <GuildMember>newMember);
        });
        
        client.on('guildUnavailable', (guild: Guild) => {
            this.guildUnavailable(guild);
        })
        
        client.on('guildUpdate', (oldGuild: Guild, newGuild: Guild) => {
            this.guildUpdate(oldGuild, newGuild);
        })
        
        client.on('invalidated', () => {
            this.invalidated();
        })
        
        client.on('inviteCreate', (invite: Invite) => {
            this.inviteCreate(invite);
        })
        
        client.on('inviteDelete', (invite: Invite) => {
            this.inviteDelete(invite);
        })
        
        client.on('message', (message: Message) => {
            this.message(message);
        })
        
        client.on('messageDelete', (message: Message | PartialMessage) => {
            this.messageDelete(<Message>message);
        })
        
        client.on('messageDeleteBulk', (messages: Collection<string, Message | PartialMessage>) => {
            this.messageDeleteBulk(<Collection<string, Message>>messages);
        })
        
        client.on('messageReactionAdd', (messageReaction: MessageReaction, user: User | PartialUser) => {
            this.messageReactionAdd(messageReaction, <User>user);
        })
        
        client.on('messageReactionRemove', (messageReaction: MessageReaction, user: User | PartialUser) => {
            this.messageReactionRemove(messageReaction, <User>user);
        })
        
        client.on('messageReactionRemoveAll', (message: Message | PartialMessage) => {
            this.messageReactionRemoveAll(<Message>message)
        })
        
        client.on('messageReactionRemoveEmoji', (messageReaction: MessageReaction) => {
            this.messageReactionRemoveEmoji(messageReaction);
        })
        
        client.on('messageUpdate', (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => {
            this.messageUpdate(<Message>oldMessage, <Message>newMessage);
        })
        
        client.on('presenceUpdate', (oldPresence: Presence | undefined, newPresence: Presence | undefined) => {
            this.presenceUpdate(<Presence>oldPresence, <Presence>newPresence);
        })
        
        client.on('rateLimit', (rateLimitInfo: RateLimitData) => {
            this.rateLimit(rateLimitInfo);
        })
        
        client.on('ready', () => {
            this.ready(client);
        })
        
        client.on('roleCreate', (role: Role) => {
            this.roleCreate(role);
        })
        
        client.on('roleDelete', (role: Role) => {
            this.roleDelete(role);
        })
        
        client.on('roleUpdate', (oldRole: Role, newRole: Role) => {
            this.roleUpdate(oldRole, newRole);
        })
        
        client.on('shardDisconnect', (event: any, id: number) => {
            this.shardDisconnect(event, id);
        })
        
        client.on('shardError', (error, shardID) => {
            this.shardError(error, shardID);
        })
        
        client.on('shardReady', (id: number) => {
            this.shardReady(id);
        })
        
        client.on('shardReconnecting', (id: number) => {
            this.shardReconnecting(id);
        })
        
        client.on('shardResume', (id: number, replayedEvents: number) => {
            this.shardResume(id, replayedEvents);
        })
        
        client.on('typingStart', (channel: Channel | PartialDMChannel, user: User | PartialUser) => {
            this.typingStart(channel, <User>user);
        })
        
        client.on('voiceStateUpdate', (oldState: VoiceState, newState: VoiceState) => {
            this.voiceStateUpdate(oldState, newState);
        })        
    }

    private _hexError(hex: string): boolean { if (!this._isHex(hex)) { console.log(`[WARN]: Invalid hex code`); return false; } else { return true; } }
    private _isHex(code: string)  : boolean { return code.match(hexExp) ? true : false}
    private _LoggingConsole()     : boolean { return this.options.log_console ? true : false; } //Need ternary because of possible undefined
    private _usingCallbacks()     : boolean { return this.options.use_callbacks ? true : false}

    private _isBlacklisted(eventName: string): boolean | undefined { //Returns undefined if there are no blacklisted events or an invalid eventName was passed
        if (this.options.blacklisted_events == undefined) return undefined;
        let blacklistedEvents = Object.keys(this.options.blacklisted_events);
        if (!blacklistedEvents.includes(eventName)) return undefined;
        for ( let [key, value] of Object.entries(this.options.blacklisted_events))
        {
            if (key == eventName) { return value; }
        }
    }

    private _LoggingChannel(guild_id: string) : boolean { //Is there a logging channel associated with this guild 
        let flag: boolean = false;
        this.options.channels?.forEach((logChannel: TextChannel) => {
            if (guild_id == logChannel.guild.id) { flag = true; }
        })
        return flag;
    }

    private _findLoggingChannel(guild_id: string) : TextChannel | undefined {
        let channel: TextChannel | undefined = undefined
        this.options.channels?.forEach((logChannel: TextChannel) => {
            if (guild_id == logChannel.guild.id) { channel = logChannel; }
        })
        return channel;
    }

    /**
     * Resolves a color based on provided string
     * First it tries to match directly then if thats not found it tries info and lastly default
     * @param color 
     */
    private _resolveColor(color: string): string {
        switch(color.toLowerCase()) {   
            case 'info'  : return this.options.colors!.info   ? this.options.colors!.info            : this.options.colors!.default!;
            case 'update': return this.options.colors!.update ? <string> this.options.colors!.update : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);           
            case 'kick'  : return this.options.colors!.kick   ? <string> this.options.colors!.kick   : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);
            case 'ban'   : return this.options.colors!.ban    ? <string> this.options.colors!.ban    : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);
            case 'join'  : return this.options.colors!.join   ? <string> this.options.colors!.join   : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);
            case 'leave' : return this.options.colors!.leave  ? <string> this.options.colors!.leave  : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);
            case 'delete': return this.options.colors!.delete ? <string> this.options.colors!.delete : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);
            case 'create': return this.options.colors!.create ? <string> this.options.colors!.create : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);
            case 'add'   : return this.options.colors!.add    ? <string> this.options.colors!.add    : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);
            case 'remove': return this.options.colors!.remove ? <string> this.options.colors!.remove : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);
        }
        return this.options.colors!.default!;
    }

    /**
     * Will log to a guilds logging channel if this logger contains one associated with the given guild id
     * 
     * @param guild_id The guild you want to log to
     * @param info The stuff you want to log (string or message embed)
     * @param embedColor [OPTIONAL] The color of the embed if there is one 
     */
    public toGuild(guild_id: string, info: string | MessageEmbed, embedColor?: string) {
        if (this._LoggingChannel(guild_id)) {
            let logChannel: TextChannel = this._findLoggingChannel(guild_id)!;
            if (embedColor) {
                let color: string = this._isHex(embedColor) ? embedColor : this._resolveColor(embedColor);
                if (typeof info == typeof MessageEmbed) (<MessageEmbed>info).setColor(color);
            }

            logChannel.send(info)
        }
    }

    public info(info: string) {
        if (this._LoggingConsole()) { console.log(`[INFO]: ${info}`) }
    }

    /* All Discord.js Client Events */

    public channelCreate(channel: GuildChannel | DMChannel, cb?: (logChannel: TextChannel, color: string, channel?: DiscordChannel) => void): void {
        if (this._isBlacklisted('channelCreate')) return;
        if (typeof channel == typeof DMChannel) return;
        
        let _channel: DiscordChannel = (<DiscordChannel>channel) ;
        if (this._LoggingConsole()) { console.log(`[EVENT][CHANNEL_CREATE][INFO]: Name: '${_channel.name}' | Guild '${_channel.guild.name  }' | Type: '${_channel.type}' | Parent: '${_channel.parent?.name}' | Permissions (First 5): '${_channel.permissionOverwrites.first(5)}'`); }   
        if (this._LoggingChannel(_channel.guild.id)) { 
            let logChannel: TextChannel = this._findLoggingChannel(_channel.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.CREATE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, _channel); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(_channel.guild.name, _channel.guild.iconURL()!)
                .setDescription(`**Channel created \`${_channel.name}\` Parent: \`${_channel.parent?.name ? _channel.parent.name : 'None'}\`**`)
                .setFooter(`ID: ${_channel.id}`)
                .setTimestamp()
            )
        }
    }

    public channelDelete(channel: GuildChannel | DMChannel, cb?: (logChannel: TextChannel, color: string, channel?: DiscordChannel) => void): void {
        if (this._isBlacklisted('channelDelete')) return;
        if (typeof channel == typeof DMChannel) return;

        let _channel: DiscordChannel = (<DiscordChannel>channel);
        if (this._LoggingConsole()) { console.log(`[EVENT][CHANNEL_DELETE][INFO]: Name: '${_channel.name}' | Guild '${_channel.guild.name  }' | Type: '${_channel.type}' | Parent: '${_channel.parent?.name}' | Permissions (First 5): '${_channel.permissionOverwrites.first(5)}'`); }
        if (this._LoggingChannel(_channel.guild.id)) { 
            let logChannel: TextChannel = this._findLoggingChannel(_channel.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.DELETE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, _channel); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(_channel.guild.name, _channel.guild.iconURL()!)
                .setDescription(`**Channel deleted \`${_channel.name}\` Parent: \`${_channel.parent?.name ? _channel.parent.name : 'None'}\`**`)
                .setFooter(`ID: ${_channel.id}`)
                .setTimestamp()
            )
        }
    }

    public channelPinsUpdate(channel: GuildChannel | DMChannel , time: Date, cb?: (logChannel: TextChannel, color: string, channel?: DiscordChannel, time?: Date) => void): void {
        if (this._isBlacklisted('channelPinsUpdate')) return;
        if (typeof channel == typeof DMChannel) return;

        let _channel: DiscordChannel = (<DiscordChannel>channel);
        if (this._LoggingConsole()) { console.log(`[EVENT][CHANNEL_DELETE][INFO]: Channel: '${_channel.name}' | Time: '${time}'`) }
        if (this._LoggingChannel(_channel.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(_channel.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, _channel, time); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(_channel.guild.name, _channel.guild.iconURL()!)
                .setDescription(`**Pins updated for <#${_channel.id}>**`)
                .setFooter(`ID: ${_channel.id}`)
                .setTimestamp()
            )
        }
    }    

    public channelUpdate(oldChannel: GuildChannel | DMChannel, newChannel: GuildChannel | DMChannel, cb?: (logChannel: TextChannel, color: string, oldChannel?: DiscordChannel, newChannel?: DiscordChannel) => void): void {
        if (this._isBlacklisted('channelUpdate')) return;
        if (typeof oldChannel == typeof DMChannel && typeof newChannel == typeof DMChannel) return;

        let _oldChannel: DiscordChannel = (<DiscordChannel>oldChannel);
        let _newChannel: DiscordChannel = (<DiscordChannel>newChannel);

        if (this._LoggingConsole()) { console.log(`[EVENT][CHANNEL_UPDATE][INFO]: Name: '${_oldChannel.name}' -> '${_newChannel.name}' | Parent: '${_oldChannel.parent?.name}' -> '${_newChannel.parent?.name}' | Position: '${_oldChannel.position}' -> '${_newChannel.position}' `) }
        if (_oldChannel.position == _newChannel.position && _oldChannel.name == _newChannel.name && _oldChannel.parent?.name == _newChannel.parent?.name) return; //Here to stop spam when a channel is moved
        if (this._LoggingChannel(_newChannel.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(_newChannel.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, _oldChannel, _newChannel); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(`${_newChannel.guild.name}`, _newChannel.guild.iconURL()!)
                .addField(`**🠗 Channel Updated 🠗** `, `• **Name:** **\`${_oldChannel.name}\`** 🠖 **\`${_newChannel.name}\`**\n• **Category:** **\`${_oldChannel.parent ? _oldChannel.parent.name : 'None'}\`** 🠖 **\`${_newChannel.parent ? _newChannel.parent.name : 'None'}\`**\n• **Position:** **\`${_oldChannel.position}\`** 🠖 **\`${_newChannel.position}\`**`)
                .setFooter(`ID: ${_newChannel.id}`)
                .setTimestamp()
            )
        }

    }

    public debug(info: string): void {
        if (this._isBlacklisted('debug')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][DEBUG][INFO]: ${info}`); }
    }

    public async emojiCreate(emoji: GuildEmoji, cb?: (logChannel: TextChannel, color: string, emoji?: GuildEmoji) => void): Promise<void> {
        if (this._isBlacklisted('emojiCreate')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][EMOJI_CREATE][INFO]: Guild: ${emoji.guild.name} | Name: ${emoji.name} | Animated: ${emoji.animated} | Identifier: ${emoji.identifier}`) }
        if (this._LoggingChannel(emoji.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(emoji.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.CREATE);
            let emojiAuthor: User = await emoji.fetchAuthor();
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, emoji); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(emojiAuthor.tag, emojiAuthor.avatarURL()!)
                .addField(`**Emoji Created** ${emoji.toString()}`, `• **Name**: \`${emoji.name}\`\n• **ID**: \`${emoji.id}\`\n• **Animated**: \`${emoji.animated}\`\n• **Identifier**: \`<:${emoji.identifier}>\``)
                .setTimestamp()
            )
        }
    }

    public async emojiDelete(emoji: GuildEmoji, cb?: (logChannel: TextChannel, color: string, emoji?: GuildEmoji) => void): Promise<void> {
        if (this._isBlacklisted('emojiDelete')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][EMOJI_CREATE][INFO]: Guild: ${emoji.guild.name} | Name: ${emoji.name} | Animated: ${emoji.animated} | Identifier: ${emoji.identifier}`) }
        if (this._LoggingChannel(emoji.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(emoji.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.DELETE);
            let emojiAuthor: User = await emoji.fetchAuthor();
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, emoji); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(emojiAuthor.tag, emojiAuthor.avatarURL()!)
                .addField(`**Emoji Deleted** ${emoji.toString()}`, `• **Name**: \`${emoji.name}\`\n• **ID**: \`${emoji.id}\`\n• **Animated**: \`${emoji.animated}\`\n• **Identifier**: \`<:${emoji.identifier}>\``)
                .setTimestamp()
            )
        }
    }

    public emojiUpdate(oldEmoji: GuildEmoji, newEmoji: GuildEmoji, cb?: (logChannel: TextChannel, color: string, oldEmoji?: GuildEmoji, newEmoji?: GuildEmoji) => void): void {
        if (this._isBlacklisted('emojiUpdate')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][EMOJI_UPDATE][INFO]: Name: ${oldEmoji.name} -> ${newEmoji.name} | Identifier: <:${oldEmoji.identifier}> -> <:${newEmoji.identifier}>`) }
        if (this._LoggingChannel(newEmoji.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(newEmoji.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, oldEmoji, newEmoji); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(newEmoji.guild.name, newEmoji.guild.iconURL()!)
                .addField(`**🠗 Emoji Update ${newEmoji.toString()} 🠗**`, `• **Name**: \`${oldEmoji.name}\` 🠖 \`${newEmoji.name}\`\n• **Identifier**: \`<:${oldEmoji.identifier}>\` 🠖 \`<:${newEmoji.identifier}>\``)
                .setFooter(`ID: ${newEmoji.id}`)
                .setTimestamp()
            )
        }
    }

    public error(error: Error): void {
        if (this._isBlacklisted('error')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][ERROR][INFO]: ${error}`); }
    }

    public guildBanAdd(guild: Guild, user: User, cb?: (logChannel: TextChannel, color: string, guild?: Guild, user?: User) => void): void {
        if (this._isBlacklisted('guildBanAdd')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_BAN_ADD][INFO]: Guild: ${guild.name} | User: ${user.tag} | User ID: ${user.id}`) }
        if (this._LoggingChannel(guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.BAN);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, guild, user); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(`Member banned`, user.avatarURL()!)
                .setDescription(`<@!${user.id}> ${user.tag}`)
                .setThumbnail(user.avatarURL()!)
                .setFooter(`ID: ${user.id}`)
                .setTimestamp()
            )
        }
    }

    public guildBanRemove(guild: Guild, user: User, cb?: (logChannel: TextChannel, color: string, guild?: Guild, user?: User) => void): void {
        if (this._isBlacklisted('guildBanRemove')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_BAN_REMOVE][INFO]: Guild: ${guild.name} | User: ${user.tag} | User ID: ${user.id}`) }
        if (this._LoggingChannel(guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.REMOVE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, guild, user); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(`Member unbanned`, user.avatarURL()!)
                .setDescription(`<@!${user.id}> ${user.tag}`)
                .setThumbnail(user.avatarURL()!)
                .setFooter(`ID: ${user.id}`)
                .setTimestamp()
            )
        }
    }

    public guildCreate(guild: Guild): void {
        if (this._isBlacklisted('guildCreate')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_CREATE][INFO]: Client joined guild '${guild.name}'`); }
    }

    public guildDelete(guild: Guild): void {
        if (this._isBlacklisted('guildDelete')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_DELETE][INFO]: Client left or was kicked from guild '${guild.name}'`); }
    }

    public guildIntegrationsUpdate(guild: Guild, cb?: (logChannel: TextChannel, color: string, guild?: Guild) => void): void {
        if (this._isBlacklisted('guildIntegrationsUpdate')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_INTEGRATIONS_UPDATE][INFO]: Integrations updated in '${guild.name}'`) }
        if (this._LoggingChannel(guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, guild); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(guild.name, guild.iconURL()!)
                .setDescription(`Integrations updated`)
                .setFooter(`Guild ID: ${guild.id}`)
                .setTimestamp()
            )
        }
    }

    public guildMemberAdd(member: GuildMember, cb?: (logChannel: TextChannel, color: string, member?: GuildMember) => void): void {
        if (this._isBlacklisted('guildMemberAdd')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_MEMBER_ADD][INFO]: Name: ${member.user.tag} | ID: ${member.user.id} | Time: ${member.joinedTimestamp}`) }
        if (this._LoggingChannel(member.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(member.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.JOIN);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, member); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(`Member joined`, member.user.avatarURL()!)
                .setDescription(`<@!${member.user.id}> ${member.user.tag}`)
                .setThumbnail(member.user.avatarURL()!)
                .setFooter(`ID: ${member.user.id}`)
                .setTimestamp()
            )
        }
    }
    
    public guildMemberRemove(member: GuildMember, cb?: (logChannel: TextChannel, color: string, member?: GuildMember) => void): void {
        if (this._isBlacklisted('guildMemberRemove')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_MEMBER_REMOVE][INFO]: Name: ${member.user.tag} | ID: ${member.user.id} | Time: ${member.joinedTimestamp}`) }
        if (this._LoggingChannel(member.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(member.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.LEAVE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, member); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(`Member left`, member.user.avatarURL()!)
                .setDescription(`<@!${member.user.id}> ${member.user.tag}`)
                .setThumbnail(member.user.avatarURL()!)
                .setFooter(`ID: ${member.user.id}`)
                .setTimestamp()
            )
        }
    }

    public guildMembersChunk(members: Collection<Snowflake, GuildMember>, guild: Guild, cb?: (logChannel: TextChannel, color: string, members?: Collection<Snowflake, GuildMember>, guild?: Guild) => void): void {
        if (this._isBlacklisted('guildMembersChunk')) return;

        if (!members.first()) return;

        let joinedGuild: Guild = members.first()!.guild;
        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_MEMBERS_CHUNK][INFO]: Mass amount of members joined ${joinedGuild.name} from ${guild.name} | Members: ${members.array().toString()}`); }
        if (this._LoggingChannel(joinedGuild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(joinedGuild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.JOIN);    
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, members, guild); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(joinedGuild.name, joinedGuild.iconURL()!)
                .addField(`Mass Member Join`, `${members.map((member: GuildMember) => `• <@!${member.user.id}>`)}`)
                .setFooter(`From: [ Guild: ${guild.name} | ID: ${guild.id} ]`)
                .setTimestamp()
            )
        } 
    }

    public guildMemberSpeaking(member: GuildMember, speaking: Speaking, cb?: (logChannel: TextChannel, color: string, member?: GuildMember, speaking?: Speaking) => void): void {
        if (this._isBlacklisted('guildMemberSpeaking')) return;
        
        const resolveSpeaking: Function = (speakingBitfield: number): string => {
            switch (speakingBitfield) {
                case Speaking.FLAGS.SPEAKING: return 'SPEAKING'
                case Speaking.FLAGS.SOUNDSHARE: return 'SOUND_SHARE'
                case Speaking.FLAGS.PRIORITY_SPEAKING: return 'PRIORITY_SPEAKING'
            }
            return '?';
        }

        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_MEMBER_SPEAKING][INFO]: Member: ${member.user.tag} | Speaking Status: ${resolveSpeaking(speaking.bitfield)}`) }
        if (this._LoggingChannel(member.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(member.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.INFO);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, member, speaking); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(member.user.tag, member.user.avatarURL()!)
                .setDescription(`Members speaking status changed | **Now:** \`${resolveSpeaking(speaking.bitfield)}\``)
            )
        }    
    }

    public guildMemberUpdate(oldMember: GuildMember, newMember: GuildMember, cb?: (logChannel: TextChannel, color: string, oldMember?: GuildMember, newMember?: GuildMember) => void): void {
        if (this._isBlacklisted('guildMemberUpdate')) return;
    
        let roles: Role[] = findMembersRolesDiffernces(oldMember, newMember);
        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_MEMBER_UPDATE][INFO]: Nickname: ${oldMember.displayName} -> ${newMember.displayName} | Avatar Changed: ${oldMember.user.avatarURL() != newMember.user.avatarURL() ? `true | ${newMember.user.avatarURL()}` : 'false'} | Added / Removed Role: ${roles[0] ? roles[0].name : 'None'}`) }
        if (this._LoggingChannel(newMember.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(newMember.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, oldMember, newMember); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(newMember.user.tag, newMember.user.avatarURL()!)
                .addField(`**🠗 Member Update 🠗**`, `• **Nickname**: \`${oldMember.displayName}\` 🠖 \`${newMember.displayName}\`\n• **Added / Removed Role**: \`${roles[0] ? roles[0].name : 'None'}\``)
                .setFooter(`ID: ${newMember.user.id}`)
                .setTimestamp()
            )
        }
    }

    public guildUnavailable(guild: Guild): void {
        if (this._isBlacklisted('guildUnavailable')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_UNAVAILABLE][INFO]: Guild: ${guild.name} | ID: ${guild.name} | Reason: Likely due to server outage`); }
    }

    public guildUpdate(oldGuild: Guild, newGuild: Guild, cb?: (logChannel: TextChannel, color: string, oldGuild?: Guild, newGuild?: Guild) => void): void {
        if (this._isBlacklisted('guildUpdate')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_UPDATE][INFO]: Before: { Name: ${oldGuild.name} }, After: { Name: ${newGuild.name} }`) }
        if (this._LoggingChannel(newGuild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(newGuild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, oldGuild, newGuild); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(newGuild.name, newGuild.iconURL()!)
                .addField(`Before`, `• Name\n\`${oldGuild.name}\``)
                .addField(`After`, `• Name\n\`${newGuild.name}\``)
                .setFooter(newGuild.id)
                .setTimestamp()
            )
        }
    }

    public invalidated(): void {
        if (this._isBlacklisted('invalidated')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][INVALIDATED][INFO]: Client invalidated`); }
    }

    /**
     * This event only triggers if the client has MANAGE_GUILD permissions for the guild, or MANAGE_CHANNEL permissions for the channel.
     */
    public inviteCreate(invite: Invite, cb?: (logChannel: TextChannel, color: string, invite?: Invite) => void): void {
        if (this._isBlacklisted('inviteCreate')) return;

        let inviteLink: string = `https://discord.gg/${invite.code}`;
        if (this._LoggingConsole()) { console.log(`[EVENT][INVITE_CREATE][INFO]: ${invite.inviter?.tag} created new invite | ${inviteLink}`) }
        if (!invite.guild) return;
        if (this._LoggingChannel(invite.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(invite.guild!.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.CREATE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, invite); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(invite.inviter?.tag, invite.inviter?.avatarURL()!)
                .setDescription(`Invite created \`${inviteLink}\``)
                .setFooter(`Expires: ${invite.expiresAt ? invite.createdAt!.toLocaleString() : 'Never'}`)
            )
        }
    }

    /**
     * This event only triggers if the client has MANAGE_GUILD permissions for the guild, or MANAGE_CHANNEL permissions for the channel.
     */
    public inviteDelete(invite: Invite, cb?: (logChannel: TextChannel, color: string, invite?: Invite) => void): void {
        if (this._isBlacklisted('inviteDelete')) return;

        let inviteLink: string = `https://discord.gg/${invite.code}` || invite.toString();
        if (this._LoggingConsole()) { console.log(`[EVENT][INVITE_DELETE][INFO]: Invite created by ${invite.inviter?.tag} was deleted or expired | ${inviteLink}`) }
        if (!invite.guild) return;
        if (this._LoggingChannel(invite.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(invite.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.DELETE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, invite); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(invite.inviter?.tag, invite.inviter?.avatarURL()!)
                .setDescription(`Invite was deleted or expired`)
                .setFooter(`Invite: ${inviteLink}`)
                .setTimestamp()
            )
        }
    }

    public message(message: Message, cb?: (logChannel: TextChannel, color: string, message?: Message) => void): void {
        if (message.author.bot) return;
        if (message.channel.type == 'dm') return; //Dont log dm's
        if (this._isBlacklisted('message')) return;

        let _channel: DiscordChannel = <DiscordChannel>message.channel;
        if (this._LoggingConsole()) { console.log(`[EVENT][MESSAGE][INFO]: '${message.author.tag}' said '${message.content}' [ Guild: ${message.guild?.name}, Channel: ${_channel.name}]`) }
        if (!message.guild) return;
        if (this._LoggingChannel(message.guild!.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(message.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.INFO);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, message); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(message.author.tag, message.author.avatarURL()!)
                .setDescription(`[Jump to message](${message.url})`)
                .addField(`${message.guild.member(message.author)?.displayName} sent a message in #${_channel.name}`, `${message.content}`)
                .setFooter(`MessageID: ${message.id}`)
                .setTimestamp()
            )
        }
    }

    public messageDelete(message: Message, cb?: (logChannel: TextChannel, color: string, message?: Message) => void): void {
        if (this._isBlacklisted('messageDelete')) return;

        let _channel: DiscordChannel = <DiscordChannel>message.channel;
        if (this._LoggingConsole()) { console.log(`[EVENT][MESSAGE_DELETE][INFO]: Message sent by '${message.author.tag}' was deleted | '${message.content}' [ Guild: ${message.guild?.name}, Channel: ${_channel.name}]`) }
        if (!message.guild) return;
        if (this._LoggingChannel(message.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(message.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.DELETE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, message); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(message.author.tag, message.author.avatarURL()!)
                .addField(`Message sent by ${message.guild.member(message.author)?.displayName} in ${(<DiscordChannel>message.channel).name} was deleted`, `${message.content}`)                
                .setFooter(`MessageID: ${message.id}`)
                .setTimestamp()
            )
        }
    }

    public messageDeleteBulk(messages: Collection<Snowflake, Message>, cb?: (logChannel: TextChannel, color: string, messages?: Collection<Snowflake, Message>) => void): void {
        if (this._isBlacklisted('messageDeleteBulk')) return;

        let sampler: Message = messages.first()!;
        let _channel: DiscordChannel = <DiscordChannel>sampler.channel;
        if (this._LoggingConsole()) { console.log(`[EVENT][MESSAGE_DELETE_BULK][INFO]: ${messages.size} messages deleted in ${_channel.name} [ Guild: ${sampler.guild?.name} ]`) }
        if (!sampler.guild) return;
        if (this._LoggingChannel(sampler.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(sampler.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.DELETE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, messages); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(sampler.guild.name, sampler.guild.iconURL()!)
                .setDescription(`${messages.size} messages deleted in <#${_channel.id}>`)
                .setTimestamp()
            )
        }
    }

    public messageReactionAdd(messageReaction: MessageReaction, user: User, cb?: (logChannel: TextChannel, color: string, reaction?: MessageReaction, user?: User) => void): void {
        if (this._isBlacklisted('messageReactionAdd')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][MESSAGE_REACTION_ADD][INFO]: ${user.tag} reacted to a message with id ${messageReaction.message.id} and emoji ${messageReaction.emoji.toString()}`) }
        if (!messageReaction.message.guild) return;
        if (this._LoggingChannel(messageReaction.message.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(messageReaction.message.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.ADD);
            let message: Message = messageReaction.message;
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, messageReaction, user); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(user.tag, user.avatarURL()!)
                .setDescription(`${user.username} reacted to a [message](${message.url}) with the emoji ${messageReaction.emoji.toString()}`)
                .setFooter(`MessageID: ${message.id}`)
                .setTimestamp()
            )
        }
    }

    public messageReactionRemove(messageReaction: MessageReaction, user: User, cb?: (logChannel: TextChannel, color: string, reaction?: MessageReaction, user?: User) => void): void {
        if (this._isBlacklisted('messageReactionRemove')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][MESSAGE_REACTION_REMOVE][INFO]: ${user.tag} removed their reaction to a message with id ${messageReaction.message.id} and emoji ${messageReaction.emoji.toString()}`) }
        if (!messageReaction.message.guild) return;
        if (this._LoggingChannel(messageReaction.message.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(messageReaction.message.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.REMOVE);
            let message: Message = messageReaction.message;
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, messageReaction, user); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(user.tag, user.avatarURL()!)
                .setDescription(`${user.username} removed their reaction to a [message](${message.url}) with the emoji ${messageReaction.emoji.toString()}`)
                .setFooter(`MessageID: ${message.id}`)
                .setTimestamp()
            )
        }
    }

    public messageReactionRemoveAll(message: Message, cb?: (logChannel: TextChannel, color: string, message: Message) => void) {
        if (this._isBlacklisted('messageReactionRemoveAll')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][MESSAGE_REACTION_REMOVE_ALL][INFO]: All reactions were removed from ${message.id}`); }
        if (!message.guild) return; 
        if (this._LoggingChannel(message.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(message.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.REMOVE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, message); return; }
            
            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(message.guild.name, message.guild.iconURL()!)
                .setDescription(`All reactions were removed from ${message.author.username}'s [message](${message.url})`)
                .setFooter(`MessageID: ${message.id}`)
                .setTimestamp()
            )
        }
    }

    public messageReactionRemoveEmoji(messageReaction: MessageReaction, cb?: (logChannel: TextChannel, color: string, reaction?: MessageReaction) => void) {
        if (this._isBlacklisted('messageReactionRemoveEmoji')) return;

        let message: Message = messageReaction.message;
        if (this._LoggingConsole()) { console.log(`[EVENT][MESSAGE_REACTION_REMOVE_EMOJI][INFO]: Bot removed ${messageReaction.emoji.toString()} reaction from ${message.id}`); }
        if (!message.guild) return;
        if (this._LoggingChannel(message.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(message.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.REMOVE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, messageReaction); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(message.guild.name, message.guild.iconURL()!)
                .setDescription(`Bot removed ${messageReaction.emoji.toString()} reaction from a [message](${message.url}) in <#${message.channel.id}>`)
                .setFooter(`MessageID: ${message.id}`)
                .setTimestamp()
            )
        }
    }

    //Basically message edit
    public messageUpdate(oldMessage: Message, newMessage: Message, cb?: (logChannel: TextChannel, color: string, oldMessage?: Message, newMessage?: Message) => void) {
        if (newMessage.author.bot) return;
        if (this._isBlacklisted('messsageUpdate')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][MESSAGE_UPDATE][INFO]: Message edited. Before: ${oldMessage.content} After: ${newMessage.content}`)}
        if (!newMessage.guild) return;
        if (this._LoggingChannel(newMessage.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(newMessage.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, oldMessage, newMessage); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(newMessage.author.tag, newMessage.author.avatarURL()!)
                .setDescription(`**Message edited in <#${newMessage.channel.id}> [Jump to message](${newMessage.url})**`)
                .addField(`Before`, `${oldMessage.content}`)
                .addField(`After`, `${newMessage.content}`)
                .setFooter(`MessageID: ${newMessage.id}`)
                .setTimestamp()
            )
        }
    }

    public presenceUpdate(oldPresence: Presence, newPresence: Presence, cb?: (logChannel: TextChannel, color: string, oldPresence?: Presence, newPresence?: Presence) => void) {
        if (this._isBlacklisted('presenceUpdate')) return;

        let oldActivites: Activity | boolean = oldPresence ? oldPresence.activities[0] : false;
        let newActivites: Activity | boolean = newPresence ? newPresence.activities[0] : false;
        if (this._LoggingConsole()) { console.log(`[EVENT][PRESENCE_UPDATE][INFO]: Old presence: ${!oldActivites ? 'None' : oldActivites.name}, status: ${oldPresence.status ? oldPresence.status : 'null'} | New presence: ${!newActivites ? 'None' : newActivites.name}, status: ${newPresence.status ? newPresence.status : 'null'}`) }
        if (!newPresence.guild) return;
        if (this._LoggingChannel(newPresence.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(newPresence.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, oldPresence, newPresence); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(newPresence.member?.user.tag, newPresence.member?.user.avatarURL()!)
                .setDescription(`**Presence updated for <@!${newPresence.member?.id}>**`)
                .addField(`Before`, `${!oldPresence ? 'No Presence' : `• Activity \n\`${!oldActivites ? 'None' : oldActivites.type} ${!oldActivites ? '' : oldActivites.name}\`\n• Details \n\`${!oldActivites ? 'None' : oldActivites.details}\`\n• Status \n\`${oldPresence.status ? oldPresence.status : 'null'}\``}`)
                .addField(`After`, `${!oldPresence ? 'No Presence' : `• Activity \n\`${!newActivites ? 'None' : newActivites.type} ${!newActivites ? '' : newActivites.name}\`\n• Details \n\`${!newActivites ? 'None' : newActivites.details}\`\n• Status \n\`${newPresence.status ? newPresence.status : 'null'}\``}`)
                .setFooter(`UserID: ${newPresence.userID}`)
                .setTimestamp()
            )
        }
    }

    public rateLimit(info: rateLimitInfo) {
        if (this._isBlacklisted(`rateLimit`)) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][RATE_LIMIT][INFO]: Client hit the rate limit. Timeout: ${info.timeout} | Limit: ${info.limit} | Method: ${info.method}`) }
    }

    public ready(client: Client) {
        if (this._isBlacklisted(`ready`)) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][READY][INFO]: ${client.user?.tag} is ready!`) }
    }

    public roleCreate(role: Role, cb?: (logChannel: TextChannel, color: string, role?: Role) => void): void {
        if (this._isBlacklisted('roleCreate')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][ROLE_CREATE][INFO]: Role created in ${role.guild.name}. Role Info: { name: ${role.name}, id: ${role.id}, permissions: ${role.permissions.toArray()}}`) }
        if (this._LoggingChannel(role.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(role.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.CREATE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, role); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(role.guild.name, role.guild.iconURL()!)
                .setDescription(`**New role created**`)
                .addField(`Name:`, `\`${role.name}\``)
                .addField(`Color:`, `\`${role.hexColor}\``)
                .addField(`Permissions:`, `${role.permissions.toArray().map(permission => `\`${permission}\``)}`)
                .setFooter(`RoleID: ${role.id}`)
                .setTimestamp()
            )
        }
    }

    public roleDelete(role: Role, cb?: (logChannel: TextChannel, color: string, role?: Role) => void): void {
        if (this._isBlacklisted('roleDelete')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][ROLE_DELETE][INFO]: ${role.name} was deleted in ${role.guild.name}`); }
        if (this._LoggingChannel(role.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(role.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.DELETE);

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(role.guild.name, role.guild.iconURL()!)
                .setDescription(`Deleted role \`${role.name}\``)
                .setFooter(`RoleID: ${role.id}`)
                .setTimestamp()
            )
        }
    }

    public roleUpdate(oldRole: Role, newRole: Role, cb?: (logChannel: TextChannel, color: string, oldRole?: Role, newRole?: Role) => void) {
        if (this._isBlacklisted(`roleUpdate`)) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][ROLE_UPDATE][INFO]: Before: Name: ${oldRole.name}, Color: ${oldRole.hexColor}, Permissions: ${oldRole.permissions.toArray()} | After: Name: ${newRole.name}, Color: ${newRole.hexColor}, Permissions: ${newRole.permissions.toArray()}`) }
        if (oldRole.name == newRole.name && oldRole.hexColor == newRole.hexColor && oldRole.permissions.bitfield == newRole.permissions.bitfield) return;
        if (this._LoggingChannel(newRole.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(newRole.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, oldRole, newRole); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(newRole.guild.name, newRole.guild.iconURL()!)
                .setDescription(`Role updated`)
                .addField(`Before`, `• Name\n\`${oldRole.name}\`\n• Hex Color\n\`${oldRole.hexColor}\`\n• Permissions\n${oldRole.permissions.toArray().map(permission => `\`${permission}\``)}`)
                .addField(`After`, `• Name\n\`${newRole.name}\`\n• Hex Color\n\`${newRole.hexColor}\`\n• Permissions\n${newRole.permissions.toArray().map(permission => `\`${permission}\``)}`)
                .setFooter(`RoleID: ${newRole.id}`)
                .setTimestamp()
            )
        }
    }

    public shardDisconnect(event: CloseEvent, id: number) {
        if (this._isBlacklisted('shardDisconnect')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][SHARD_DISCONNECT][INFO]: Shard with id ${id} disconnected and wont reconnect`); }
    }

    public shardError(error: Error, shardID: number) {
        if (this._isBlacklisted('shardError')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][SHARD_ERROR][INFO]: Shard with id ${shardID} encountered a connection error`); throw error; }
    }

    public shardReady(id: number, unavailableGuilds?: Set<string>) {
        if (this._isBlacklisted('shardReady')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][SHARD_READY][INFO]: Shard with id ${id} is ready. Unavailable Guilds: ${!unavailableGuilds ? 'None' : [...unavailableGuilds.values()]}`) }
    }

    public shardReconnecting(id: number) {
        if (this._isBlacklisted('shardReconnecting')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][SHARD_RECONNECTING][INFO]: Shard with id ${id} is reconnecting`) }
    }

    public shardResume(id: number, replayedEvents: number) {
        if (this._isBlacklisted('shardResume')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][SHARD_RECONNECTING][INFO]: Shard with id ${id} has resumed work. Total Replayed Events: ${replayedEvents}`) }
    }

    public typingStart(channel: Channel, user: User, cb?: (logChannel: TextChannel, color: string, channel?: DiscordChannel, user?: User) => void) {
        if (this._isBlacklisted('typingStart')) return;

        if (channel.type != 'text') return;
        let _channel: TextChannel = <TextChannel>channel;
        if (this._LoggingConsole()) { console.log(`[EVENT][TYPING_START][INFO]: ${user.tag} started typing in '${_channel.name}'`) }
        if (!_channel.guild) return;
        if (this._LoggingChannel(_channel.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(_channel.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.INFO);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, _channel, user); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(user.tag, user.avatarURL()!)
                .setDescription(`**${user.username} started typing in <#${_channel.id}>**`)
                .setFooter(`ChannelID: ${_channel.id}`)
                .setTimestamp()
            )
        }
    }

    public userUpdate(oldUser: User, newUser: User) {
        if (this._isBlacklisted('userUpdate')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][USER_UPDATE][INFO]: User updated. Before: { Username: ${oldUser.username}, Tag: ${oldUser.tag}, Avatar URL ${oldUser.avatarURL()} } | After: { Username: ${newUser.username}, Tag: ${newUser.tag}, Avatar URL: ${newUser.avatarURL()} }`) }
    }

    public voiceStateUpdate(oldState: VoiceState, newState: VoiceState, cb?: (logChannel: TextChannel, color: string, oldState?: VoiceState, newState?: VoiceState) => void) {
        if (this._isBlacklisted('voiceStateUpdate')) return;
        
        if (!oldState.channel && !newState.channel && oldState.channel!.id == newState.channel!.id) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][VOICE_STATE_UPDATE][INFO]: User changes voice channels. ${oldState.channel ? oldState.channel.name : 'None'} -> ${newState.channel ? newState.channel.name : 'None'}`) }
        if (!newState.guild || !oldState.guild) return;
        if (this._LoggingChannel(newState.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(newState.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, oldState, newState); return; }


            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(newState.member?.user.tag, newState.member?.user.avatarURL()!)
                .setDescription(`<@!${newState.member ? newState.member.id : (oldState.member ? oldState.member.id : 'null')}> switched voice channels \`${!oldState.channel ? 'None' : oldState.channel.name} 🠖 ${!newState.channel ? 'None' : newState.channel.name}\``)
                .setFooter(`UserID: ${newState.member ? newState.member.id : (oldState.member ? oldState.member.id : 'null')}`)
                .setTimestamp()
            )
        }
    }

    public warn(info: string) {
        if (this._isBlacklisted('warn')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][WARN][INFO]: ${info}`) }
    }

    public webhookUpdate(channel: TextChannel, cb?: (logChannel: TextChannel, color: string, channel: TextChannel) => void) {
        if (this._isBlacklisted('webhookUpdate')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][WEBHOOK_UPDATE][INFO]: A webhook for channel #${channel.name} was updated`) }
        if (this._LoggingChannel(channel.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(channel.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);
            if (this._usingCallbacks() && cb != undefined) { cb(logChannel, color, channel); return; }

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(channel.guild.name, channel.guild.iconURL()!)
                .setDescription(`A webhook for <#${channel.id}> has been updated`)
                .setFooter(`ChannelID: ${channel.id}`)
                .setTimestamp()
            )
        }
    }

    /* End of Discord.js Client Events */

}

