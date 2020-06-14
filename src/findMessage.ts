import { Message, TextChannel, Snowflake} from "discord.js";

/** COMMAND : getMessage
 * 
 * @description
 *   Retrieves a message from a provided channel by that messages id
 * 
 * @param { TextChannel } channel The channel to search for the message in
 * @param { Snowflake } id The id of the message we are trying to fetch
 * @param { Function } cb The message callback (optional)
 * 
 * @returns { Promise<Message | undefined> } The message found if no callback function is provided. If a callback function is provided then the main function returns undefined
 */

export async function findMessage(channel: TextChannel, message_id: Snowflake, cb?: (message: Message) => void): Promise<Message | undefined>
{
    let found: Message = await channel.messages.fetch(message_id);
    if (!cb || cb == undefined) {
        return found;
    } else {
        cb(found);
        return undefined;
    }
}
