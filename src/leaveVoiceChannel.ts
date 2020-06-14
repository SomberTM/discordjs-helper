import { VoiceState } from "discord.js";

/** COMMAND: leaveVoiceChannel
 * 
 * @param { VoiceState } voiceState The voice state of a certain guild
 * 
 * @returns { boolean } success?
 * 
 */

export function leaveVoiceChannel(voiceState: VoiceState): boolean
{
    if (!voiceState.channel || !voiceState.connection) { return false; }
    voiceState.connection.disconnect();
    return true;
}