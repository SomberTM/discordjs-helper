import { VoiceChannel, VoiceConnection } from 'discord.js'

/** COMMAND : joinVoiceChannel
 * 
 * @description
 *   Joins the given voice channel then returns the connection as a promise or within a callback function
 * 
 * @param { VoiceChannel } vc The voice channel you want the bot to join 
 * @param { Function } cb Optional callback function that includes the VoiceConnection to the voice channel
 * 
 * @returns { Promise<VoiceConnection | undefined> } VoiceConnection
 * 
 * Discord.VoiceChannel -> https://discord.js.org/#/docs/main/stable/class/VoiceConnection
 */
export async function joinVoiceChannel(vc: VoiceChannel, cb?: (connection: VoiceConnection) => void): Promise<VoiceConnection | undefined>
{
    if (vc.type != 'voice') { console.log(`Cannot join a non-voice channel`); return undefined; }

    let connection: VoiceConnection = await vc.join();
    if (!cb || cb == undefined)
    {
        return connection;
    } else {
        cb(connection);
    }
}