import { MessageMentions } from 'discord.js';

/** COMMAND : isMember
 * 
 * @description
 *   Takes in a message that the users thinks is a member mention and returns if it is or not
 *     -> <@341741687065804812> = true | <@!341741687065804812> = true | <@&715790001023221801> = false | <#708922295644717159> = false
 * 
 * @param { string } mention
 * 
 * @return { boolean } 
 * 
 */

export function isMember(mention: string): boolean
{
    let MEMBER_PATTERN: RegExp = MessageMentions.USERS_PATTERN;
    return mention.match(MEMBER_PATTERN) ? true : false;
}   



/** COMMAND : isChannel
 * 
 * @description
 *   Takes in a message that the users thinks is a channel mention and returns if it is or not
 *     -> <#708922295644717159> = true | <@341741687065804812> = false | <@!341741687065804812> = false | <@&715790001023221801> = false 
 * 
 * @param { string } mention
 * 
 * @return { boolean }
 * 
 */

export function isChannel(mention: string): boolean
{
    let CHANNEL_PATTERN: RegExp = MessageMentions.CHANNELS_PATTERN;
    return mention.match(CHANNEL_PATTERN) ? true : false;
}



/** COMMAND : isRole
 * 
 * @description
 *   Takes in a message that the users thinks is a channel mention and returns if it is or not
 *     -> <@&715790001023221801> = true  | <#708922295644717159> = false | <@341741687065804812> = false | <@!341741687065804812> = false
 * 
 * @param { stirng } mention
 * 
 * @return { boolean }
 *  
 */

export function isRole(mention: string): boolean
{
    let ROLE_PATTERN: RegExp = MessageMentions.ROLES_PATTERN;
    return mention.match(ROLE_PATTERN) ? true : false;
}



/** COMMAND : isEveryone / isHere
 * 
 * @description
 *   Returns whether the mention was @everyone or @here
 * 
 * @param { string } mention
 * 
 * @return { boolean } 
 * 
 */

export function isEveryone(mention: string): boolean
{
    let EVERYONE_PATTERN: RegExp = MessageMentions.EVERYONE_PATTERN;
    return mention.match(EVERYONE_PATTERN) ? true : false;
}

export function isHere(mention: string): boolean
{
    let EVERYONE_PATTERN: RegExp = MessageMentions.EVERYONE_PATTERN;
    return mention.match(EVERYONE_PATTERN) ? true : false;
}



/** COMMAND : isMention
 * 
 * @description
 *   Returns whether the string provided is a mention
 *     -> Solely based off if the string has a < and > within it and its length is > 15
 * 
 * @param { string } mention
 * 
 * @return { boolean }
 * 
 */

export function isMention(mention: string): boolean
{
    return mention.includes("<") && mention.includes(">") && mention.length > 15 ? true : false;
}

export default {
    isMember,
    isChannel,
    isRole,
    isEveryone,
    isHere,
    isMention
}