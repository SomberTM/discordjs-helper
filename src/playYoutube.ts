import ytdl from 'ytdl-core-discord'
import { videoFormat } from 'ytdl-core'

import { VoiceChannel, VoiceConnection, StreamDispatcher } from 'discord.js'

import { joinVoiceChannel } from './joinVoiceChannel'

import { Readable } from 'stream';

/** COMMAND : playYoutube
 * 
 * @description
 *   Plays a youtube video when provided with a voice channel and url
 * 
 * @param { VoiceChannel } channel The voice channel for the bot to connect to
 * @param { string } url The url for the youtube video that the bot will play
 * @param { Function } fn Optional function that is called when the bot is finished playing | usage -> playYoutube(channel, url, (video_info?) => { stuff })
 * 
 * @returns { Promise<boolean> } StreamDispatcher
 *  
 */

export async function playYoutube(channel: VoiceChannel, url: string, fn?: (info?: videoFormat) => void): Promise<boolean>
{
    if (!channel || !url) return false;
    return joinVoiceChannel(channel, async (connection: VoiceConnection) => {
        let video_info: videoFormat;
        let stream: Readable = (await ytdl(url)).on('info', (info: videoFormat) => video_info = info);
        let dispatcher: StreamDispatcher = connection.play(stream, { type: 'opus' });

        dispatcher.on('finish', () => {
            connection.disconnect();

            if (fn || fn != undefined) {
                fn(video_info);
            }
        }) 
    }) ? true : false;
}
