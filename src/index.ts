//Main library
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

//Utils
export * from './utils/Queue';
export * from './utils/isID';
export * from './utils/DiscordChannel';
export * from './utils/Logger';

//Test Code

/*
require('dotenv').config();

const ytdl = require('ytdl-core-discord');

const { Client, MessageEmbed } = require('discord.js');

const { getArgs } = require('./getArgs'); 
const { getCommand } = require('./getCommand');

const { isMember, isChannel, isRole, isEveryone, isMention } = require('./mentionChecks');

const { findRole } = require('./findRole');
const { findRoles } = require('./findRoles');

const { findChannel } = require('./findChannel');
const { findChannels } = require('./findChannels');

const { findMessage } = require('./findMessage'); 

const { joinVoiceChannel } = require('./joinVoiceChannel');
const { leaveVoiceChannel } = require('./leaveVoiceChannel');
const { leaveAllVoiceChannels } = require('./leaveAllVoiceChannels');

const { muteUser, unmuteUser } = require('./muteUser');

const { roleReaction } = require('./roleReaction');
const { pageReaction } = require('./pageReaction');

const { playYoutube } = require('./playYoutube');

const { Queue } = require('./utils/Queue');

//require under one namespace
const helper = require('./discordjs-helper');

const client = new Client();

pageReaction.init(client);

client.on('ready', () => {
    console.log(`Bot online`);
});

client.on('message', async (message: any) => {

    if (!message.content.startsWith("ts.")) return;

                     Tests 
        let args = getArgs(message, "ts.");
        let cmd = getCommand(args);

        switch(cmd) {

            case 'test':
                //if (!args[0]) return;
                let msg = await message.channel.send(new MessageEmbed().setTitle(`\`${message.guild.name}\` members`));
                let users = message.guild.members.cache.array();
                let formatted = [];
                for (let i = 0; i < users.length; i++) {
                    formatted.push(`**${i+1}:** ${users[i].user.tag}`);
                }
                new pageReaction(msg, formatted, 3);
                break;

            case 'unamused':
                //roleReaction.help();
                message.channel.send(`😒`);
                break;

            case 'rr-add':
            case 'rr-create':
                if (!args[0] || !args[1] || !message.mentions.roles.first()) return;

                let toReactTo = await findMessage(message.channel, args[0]);
                let emoji = args[1];
                let role = message.mentions.roles.first();

                console.log(`New Role Reaction ${toReactTo.id}, ${emoji}, ${role.name}`);
                new roleReaction(toReactTo, emoji, role);
                break;

            case 'play':
                if (!args[0]) { message.channel.send(`Provide a url for me to play`); return; }
                if (!message.member.voice.channel) { message.channel.send(`Please join a voice channel first`); return; }
                let url = args[0];
                let channel = message.member.voice.channel;

                playYoutube(channel, url, async (info: any) => {
                    message.channel.send(`Finished playing \`${info.title}\` by \`${info.author.name}\`!`);
                }); 

                break;

            case 'stop':
                leaveVoiceChannel(message.guild.voice);
                // leaveAllVoiceChannels(message.client.guilds.cache);
                break;

            case 'join':
                let connection = await joinVoiceChannel(message.member.voice.channel);
                break;

            case 'mute':
                if (!args[0] || !args[1] || !message.mentions.members.first()) return;
                let mute_seconds = parseInt(args[1]);
                let toMute = message.mentions.members.first();

                message.channel.send(`Muted ${toMute.toString()} for ${mute_seconds} seconds`);

                muteUser(toMute, mute_seconds, () => {
                    message.channel.send(`Unmuted ${toMute.toString()} after ${mute_seconds} seconds`);
                });              

                break;

            case 'role-find':             
                findRole(args[0], message.guild, args[1], (role: any) => {
                    console.log( role.name );
                });

                let admin = findRole(args[0], message.guild, args[1]);
                message.channel.send(new MessageEmbed()
                    .setColor(`71cee3`)
                    .setTitle(`Role: ${admin.name}`)
                    .setDescription(`ID: ${admin.id}\nPerms: ${admin.permissions.bitfield}\nColor: ${admin.hexColor}\nMembers: ${admin.members.map((member: any) => `${member.user.username}`)}`)
                );

                break;

        }

        if (!args[0]) return;
        if (!isMention(args[0])) return;
        
            console.log(`${isMember(args[0])} | ${args[0]}`);
            console.log(`${isChannel(args[0])} | ${args[0]}`);
            console.log(`${isRole(args[0])} | ${args[0]}`);
            console.log(`${isEveryone(args[0])} | ${args[0]}`);
            
});

client.login(process.env.TOKEN);
*/