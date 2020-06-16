import { DiscordChannel } from './DiscordChannel'
import { GuildChannel, DMChannel, MessageEmbed, TextChannel, Guild } from 'discord.js';

export type LoggerOptions = {
    log_console?: boolean,
    channel?: TextChannel | undefined,
    colors?: LoggerColors
};

export type LoggerColors = {
    info?: string,
    update?: string,
    delete?: string,
    kick?: string,
    ban?: string,
    leave?: string,
    create?: string,
    default?: string
}

type ColorResolvable = {
    INFO: string,
    UPDATE: string,
    DELETE: string,
    KICK: string,
    BAN: string,
    LEAVE: string,
    CREATE: string
}

export class Logger {

    private options: LoggerOptions;
    private ColorResolvables: ColorResolvable;

    constructor(options?: LoggerOptions)
    {
        
        this.options = (options || options != undefined) ? options : { log_console: false, channel: undefined, colors: { default: '23272A' } };
        if (!this.options.colors)  { this.options.colors = {}; }
        if (!this.options.colors.default) { this.options.colors.default = '23272A'; }
        if (!this.options.channel) { this.options.channel = undefined; }
        
        this.ColorResolvables = {
            INFO: 'info',
            UPDATE: 'update',
            DELETE: 'delete',
            KICK: 'kick',
            BAN: 'ban',
            LEAVE: 'leave',
            CREATE: 'create'
        }

    }

    getLoggerOptions(): LoggerOptions { return this.options; }
    setLoggerOptions(new_options: LoggerOptions) { this.options = new_options; }

    getLoggerColors(): LoggerColors { return this.options!.colors!; }
    setLoggerColors(new_colors: LoggerColors) { this.options.colors = new_colors; }

    getLogChannel(): TextChannel | undefined { return this.options.channel != undefined ? this.options.channel : undefined }
    setLogChannel(new_channel: TextChannel) { this.options.channel = new_channel }

    infoColor(color: string)   { if (this._hexError(color)) return; this.options.colors!.info = color;   }
    updateColor(color: string) { if (this._hexError(color)) return; this.options.colors!.update = color; }
    deleteColor(color: string) { if (this._hexError(color)) return; this.options.colors!.delete = color; } 
    kickColor(color: string)   { if (this._hexError(color)) return; this.options.colors!.kick = color;   }
    banColor(color: string)    { if (this._hexError(color)) return; this.options.colors!.ban = color;   }  
    leaveColor(color: string)  { if (this._hexError(color)) return; this.options.colors!.leave = color;  } 
    createColor(color: string) { if (this._hexError(color)) return; this.options.colors!.create = color; }

    private _hexError(hex: string): boolean { if (this._isHex(hex)) { console.log(`[WARN]: Invalid hex code`); return false; } else { return true; } }
    private _isHex(code: string)  : boolean { return code.match(/[0-9a-fA-F]{6}/) ? true : false}
    private _LoggingConsole()     : boolean { return this.options.log_console ? true : false; } //Need ternary because of possible undefined
    private _LoggingChannel()     : boolean { return this.options.channel != undefined ? true : false; }

    private _resolveColor(color: string): string {
        switch(color.toLowerCase()) {   
            case 'info'  : return this.options.colors!.info   ? this.options.colors!.info            : this.options.colors!.default!;
            case 'update': return this.options.colors!.update ? <string> this.options.colors!.update : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);
            case 'delete': return this.options.colors!.delete ? <string> this.options.colors!.delete : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);
            case 'kick'  : return this.options.colors!.kick   ? <string> this.options.colors!.kick   : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);
            case 'ban'   : return this.options.colors!.ban    ? <string> this.options.colors!.ban    : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);
            case 'leave' : return this.options.colors!.leave  ? <string> this.options.colors!.leave  : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);
            case 'create': return this.options.colors!.create ? <string> this.options.colors!.create : (this.options.colors!.info ? <string> this.options.colors!.info : <string> this.options.colors!.default);
        }
        return this.options.colors!.default!;
    }

    public channelCreate(channel: GuildChannel | DMChannel ) {
        if (typeof channel == typeof DMChannel) { return; }
        
        let _channel: DiscordChannel = (<DiscordChannel>channel) ;
        if (this._LoggingConsole()) { console.log(`[EVENT][CHANNEL_CREATE][INFO]: Name: '${_channel.name}' | Guild '${_channel.guild.name  }' | Type: '${_channel.type}' | Parent: '${_channel.parent?.name}' | Permissions (First 5): '${_channel.permissionOverwrites.first(5)}'`); }
        if (this._LoggingChannel()) { 
            let color: string = this._resolveColor(this.ColorResolvables.CREATE);

            this.options.channel!.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(_channel.guild.name, _channel.guild.iconURL()!)
                .setDescription(`**Channel created \`${_channel.name}\` Parent: \`${_channel.parent?.name ? _channel.parent.name : 'None'}\`**`)
            )
        }
    }

    public channelDelete(channel: GuildChannel | DMChannel) {
        if (typeof channel == typeof DMChannel) { return; }

        let _channel: DiscordChannel = (<DiscordChannel>channel) ;
        if (this._LoggingConsole()) { console.log(`[EVENT][CHANNEL_DELETE][INFO]: Name: '${_channel.name}' | Guild '${_channel.guild.name  }' | Type: '${_channel.type}' | Parent: '${_channel.parent?.name}' | Permissions (First 5): '${_channel.permissionOverwrites.first(5)}'`); }
        if (this._LoggingChannel()) { 
            let color: string = this._resolveColor(this.ColorResolvables.DELETE);

            this.options.channel!.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(_channel.guild.name, _channel.guild.iconURL()!)
                .setDescription(`**Channel deleted \`${_channel.name}\` Parent: \`${_channel.parent?.name ? _channel.parent.name : 'None'}\`**`)
            )
        }
    }

    public channelPinsUpdate(channel: GuildChannel | DMChannel , time: Date) {
        if (typeof channel == typeof DMChannel) { return; }

        let _channel: DiscordChannel = (<DiscordChannel>channel);
        if (this._LoggingConsole()) { console.log(`[EVENT][CHANNEL_DELETE][INFO]: Channel: '${_channel.name}' | Time: '${time}'`) }
        if (this._LoggingChannel()) {
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);

            this.options.channel!.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(_channel.guild.name, _channel.guild.iconURL()!)
                .setDescription(`**Pins updated in <#${_channel.id}>**`)
                .setFooter(time)
            )
        }
    }    

    public channelUpdate(oldChannel: GuildChannel | DMChannel, newChannel: GuildChannel | DMChannel) {
        if (typeof oldChannel == typeof DMChannel && typeof newChannel == typeof DMChannel) { return; }

        let _oldChannel: DiscordChannel = (<DiscordChannel>oldChannel);
        let _newChannel: DiscordChannel = (<DiscordChannel>newChannel);
        if (this._LoggingConsole()) { console.log(`[EVENT][CHANNEL_UPDATE][INFO]: Name: '${_oldChannel.name}' -> '${_newChannel.name}' | Parent: '${_oldChannel.parent?.name}' -> '${_newChannel.parent?.name}' | Position: '${_oldChannel.position}' -> '${_newChannel.position}' `) }
        if (this._LoggingChannel()) {
            let color: string = this._resolveColor(this.ColorResolvables.UPDATE);

            this.options.channel!.send(
                new MessageEmbed()
                .setColor(color)
                .setAuthor(`${_newChannel.guild.name}`, _newChannel.guild.iconURL()!)
                .setDescription(`**Channel Updated**`)
                .addField() //Add updates
            )
        }

    }

}

/*
public StartLog(channel?: TextChannel) { this.StartLogging(channel); }
public StartLogs(channel?: TextChannel) { this.StartLogging(channel); }
public StartLogging(channel?: TextChannel)  {
    if (!this._LoggingConsole()) { this.options!.log_console = true; } 
    this.options.channel = channel;
}
*/