import { Message } from 'discord.js';

/** COMMAND : getArgs
 * 
 * @description 
 *  Returns an array of the "arguments" in the message
 *    -> Essentially, its splitting the message content by each space
 * 
 * @param { Message } message -> The message received by the client
 * @param { string } prefix -> The prefix for the bot
 * 
 * @return { string[] } args
 * 
 */

export function getArgs(message: Message, prefix: string): string[]
{
    if (!message.content) return [];
    return message.content.slice(prefix.length).trim().split(/ +/g);
}
