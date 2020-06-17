import { DiscordChannel } from './DiscordChannel'
import { GuildChannel, DMChannel, MessageEmbed, TextChannel, GuildEmoji, User, Guild, GuildMember } from 'discord.js';

export type LoggerOptions = {
    log_console?: boolean,
    channels?: TextChannel[] | undefined,
    colors?: LoggerColors,
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

const hexExp: RegExp = /[0-9a-fA-f]{6}/;

export class Logger {

    private options: LoggerOptions;
    private ColorResolvables: ColorResolvable;

    constructor(options?: LoggerOptions)
    {
        
        this.options = (options || options != undefined) ? options : { 
            log_console: false, 
            channels: undefined, 
            colors: { default: '23272A' }, 
            blacklisted_events: this.defaultBlacklistedEvents() 
        };

        if (!this.options.colors)  { this.options.colors = {}; }
        if (!this.options.colors.default) { this.options.colors.default = '23272A'; }
        if (!this.options.channels) { this.options.channels = undefined; }
        if (!this.options.blacklisted_events) { this.options.blacklisted_events = this.defaultBlacklistedEvents(); }
        
        this.ColorResolvables = {
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

    }

    public getLoggerOptions(): LoggerOptions { return this.options; }
    public setLoggerOptions(new_options: LoggerOptions) { this.options = new_options; }

    public getLoggerColors(): LoggerColors { return this.options!.colors!; }
    public setLoggerColors(new_colors: LoggerColors) { this.options.colors = new_colors; }

    public getLogChannels(): TextChannel[] | undefined { return this.options.channels != undefined ? this.options.channels : undefined }
    public setLogChannels(new_channels: TextChannel[]) { this.options.channels = new_channels }
    public addLogChannel(new_channel: TextChannel) { this.options.channels = this.options.channels == undefined ? [] : this.options.channels;  this.options.channels?.push(new_channel); }  

    public defaultBlacklistedEvents(): BlacklistedEvents { 
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

    private _hexError(hex: string): boolean { if (!this._isHex(hex)) { console.log(`[WARN]: Invalid hex code`); return false; } else { return true; } }
    private _isHex(code: string)  : boolean { return code.match(hexExp) ? true : false}
    private _LoggingConsole()     : boolean { return this.options.log_console ? true : false; } //Need ternary because of possible undefined
    
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

    public channelCreate(channel: GuildChannel | DMChannel ) {
        if (this._isBlacklisted('channelCreate')) return;
        if (typeof channel == typeof DMChannel) return;
        
        let _channel: DiscordChannel = (<DiscordChannel>channel) ;
        if (this._LoggingConsole()) { console.log(`[EVENT][CHANNEL_CREATE][INFO]: Name: '${_channel.name}' | Guild '${_channel.guild.name  }' | Type: '${_channel.type}' | Parent: '${_channel.parent?.name}' | Permissions (First 5): '${_channel.permissionOverwrites.first(5)}'`); }
        if (this._LoggingChannel(_channel.guild.id)) { 
            let logChannel: TextChannel = this._findLoggingChannel(_channel.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.CREATE);

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

    public channelDelete(channel: GuildChannel | DMChannel) {
        if (this._isBlacklisted('channelDelete')) return;
        if (typeof channel == typeof DMChannel) return;

        let _channel: DiscordChannel = (<DiscordChannel>channel) ;
        if (this._LoggingConsole()) { console.log(`[EVENT][CHANNEL_DELETE][INFO]: Name: '${_channel.name}' | Guild '${_channel.guild.name  }' | Type: '${_channel.type}' | Parent: '${_channel.parent?.name}' | Permissions (First 5): '${_channel.permissionOverwrites.first(5)}'`); }
        if (this._LoggingChannel(_channel.guild.id)) { 
            let logChannel: TextChannel = this._findLoggingChannel(_channel.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.DELETE);

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

    public channelPinsUpdate(channel: GuildChannel | DMChannel , time: Date) {
        if (this._isBlacklisted('channelPinsUpdate')) return;
        if (typeof channel == typeof DMChannel) return;

        let _channel: DiscordChannel = (<DiscordChannel>channel);
        if (this._LoggingConsole()) { console.log(`[EVENT][CHANNEL_DELETE][INFO]: Channel: '${_channel.name}' | Time: '${time}'`) }
        if (this._LoggingChannel(_channel.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(_channel.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);

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

    public channelUpdate(oldChannel: GuildChannel | DMChannel, newChannel: GuildChannel | DMChannel) {
        if (this._isBlacklisted('channelUpdate')) return;
        if (typeof oldChannel == typeof DMChannel && typeof newChannel == typeof DMChannel) return;

        let _oldChannel: DiscordChannel = (<DiscordChannel>oldChannel);
        let _newChannel: DiscordChannel = (<DiscordChannel>newChannel);

        if (this._LoggingConsole()) { console.log(`[EVENT][CHANNEL_UPDATE][INFO]: Name: '${_oldChannel.name}' -> '${_newChannel.name}' | Parent: '${_oldChannel.parent?.name}' -> '${_newChannel.parent?.name}' | Position: '${_oldChannel.position}' -> '${_newChannel.position}' `) }
        if (_oldChannel.position == _newChannel.position && _oldChannel.name == _newChannel.name && _oldChannel.parent?.name == _newChannel.parent?.name) return; //Here to stop spam when a channel is moved
        if (this._LoggingChannel(_newChannel.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(_newChannel.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);

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

    public debug(info: string) {
        if (this._isBlacklisted('debug')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][DEBUG][INFO]: ${info}`); }
    }

    public async emojiCreate(emoji: GuildEmoji) {
        if (this._isBlacklisted('emojiCreate')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][EMOJI_CREATE][INFO]: Guild: ${emoji.guild.name} | Name: ${emoji.name} | Animated: ${emoji.animated} | Identifier: ${emoji.identifier}`) }
        if (this._LoggingChannel(emoji.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(emoji.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.CREATE);
            let emojiAuthor: User = await emoji.fetchAuthor();

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(emojiAuthor.tag, emojiAuthor.avatarURL()!)
                .addField(`**Emoji Created** ${emoji.toString()}`, `• **Name**: \`${emoji.name}\`\n• **ID**: \`${emoji.id}\`\n• **Animated**: \`${emoji.animated}\`\n• **Identifier**: \`<:${emoji.identifier}>\``)
                .setTimestamp()
            )
        }
    }

    public async emojiDelete(emoji: GuildEmoji) {
        if (this._isBlacklisted('emojiDelete')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][EMOJI_CREATE][INFO]: Guild: ${emoji.guild.name} | Name: ${emoji.name} | Animated: ${emoji.animated} | Identifier: ${emoji.identifier}`) }
        if (this._LoggingChannel(emoji.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(emoji.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.DELETE);
            let emojiAuthor: User = await emoji.fetchAuthor();

            logChannel.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(emojiAuthor.tag, emojiAuthor.avatarURL()!)
                .addField(`**Emoji Deleted** ${emoji.toString()}`, `• **Name**: \`${emoji.name}\`\n• **ID**: \`${emoji.id}\`\n• **Animated**: \`${emoji.animated}\`\n• **Identifier**: \`<:${emoji.identifier}>\``)
                .setTimestamp()
            )
        }
    }

    public emojiUpdate(oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {
        if (this._isBlacklisted('emojiUpdate')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][EMOJI_UPDATE][INFO]: Name: ${oldEmoji.name} -> ${newEmoji.name} | Identifier: <:${oldEmoji.identifier}> -> <:${newEmoji.identifier}>`) }
        if (this._LoggingChannel(newEmoji.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(newEmoji.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);

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

    public error(error: Error) {
        if (this._isBlacklisted('error')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][ERROR][INFO]: ${error}`); }
    }

    public guildBanAdd(guild: Guild, user: User) {
        if (this._isBlacklisted('guildBanAdd')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_BAN_ADD][INFO]: Guild: ${guild.name} | User: ${user.tag} | User ID: ${user.id}`) }
        if (this._LoggingChannel(guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.BAN);

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

    public guildBanRemove(guild: Guild, user: User) {
        if (this._isBlacklisted('guildBanRemove')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_BAN_REMOVE][INFO]: Guild: ${guild.name} | User: ${user.tag} | User ID: ${user.id}`) }
        if (this._LoggingChannel(guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.REMOVE);

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

    public guildCreate(guild: Guild) {
        if (this._isBlacklisted('guildCreate')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_CREATE][INFO]: Client joined guild '${guild.name}'`); }
    }

    public guildDelete(guild: Guild) {
        if (this._isBlacklisted('guildDelete')) return;
        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_DELETE][INFO]: Client left or was kicked from guild '${guild.name}'`); }
    }

    public guildIntegrationsUpdate(guild: Guild) {
        if (this._isBlacklisted('guildIntegrationsUpdate')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_INTEGRATIONS_UPDATE][INFO]: Integrations updated in '${guild.name}'`) }
        if (this._LoggingChannel(guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);

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

    public guildMemberAdd(member: GuildMember) {
        if (this._isBlacklisted('guildMemberAdd')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_MEMBER_ADD][INFO]: Name: ${member.user.tag} | ID: ${member.user.id} | Time: ${member.joinedTimestamp}`) }
        if (this._LoggingChannel(member.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(member.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.CREATE);

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
    
    public guildMemberRemove(member: GuildMember) {
        if (this._isBlacklisted('guildMemberRemove')) return;

        if (this._LoggingConsole()) { console.log(`[EVENT][GUILD_MEMBER_REMOVE][INFO]: Name: ${member.user.tag} | ID: ${member.user.id} | Time: ${member.joinedTimestamp}`) }
        if (this._LoggingChannel(member.guild.id)) {
            let logChannel: TextChannel = this._findLoggingChannel(member.guild.id)!;
            let color: string = this._resolveColor(this.ColorResolvables.LEAVE);

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
}

