import { GuildMember, Role, GuildChannel, Permissions, Guild } from "discord.js";

/** COMMAND : muteUser  
 * 
 * @description
 *   Mutes the given user for the alloted amount of seconds. The optional function callback argument is called when the user is unmuted / the alloted time has passed
 *   By default this function assumes the mute role to be named 'muted' and will search for that first before creating a mute role if none is provided
 * 
 * @param { GuildMember } to_mute The member to mute. Easily accessed by message.mentions.members.first() (assuming someone was mentioned in the message)
 * @param { number } time_seconds The number of seconds to mute the member for. (To convert from string to number you can use parseInt(string) or +"numbers" i.e. +"12345" = 12345)
 * @param { Function } fn [optional argument] The function called when the given time has passed / the member is unmuted
 * @param { Role } muteRole [optional argument] A role that you are using as the mute role. This function will also automatically check that the permission overwrites are correct for this role in each channel. If this argument is fulfilled then it wont create a new mute role.
 * 
 */

export async function muteUser(to_mute: GuildMember, time_seconds: number, fn?: () => void, muteRole?: Role)
{
    //if (!to_mute.permissions.has('MUTE_MEMBERS')) return;
    if (!muteRole) {
        let mutedRole: Role | undefined = to_mute.guild.roles.cache.find((role: Role) => role.name == 'muted');
        if (mutedRole == undefined) {
            try {
                mutedRole = await to_mute.guild.roles.create({
                    data: {
                        name: 'muted',
                        permissions: Permissions.DEFAULT
                    },
                    reason: `Created 'muted' role so that users can be muted / stopped from sending messages for an alloted time`
                });

                muteTimeout(to_mute, mutedRole, time_seconds, fn);

            } catch (err) {
                console.log(err);
            }
        } else {
            muteTimeout(to_mute, mutedRole, time_seconds, fn);
        }

    } else if ( muteRole && muteRole != undefined ) {
        muteTimeout(to_mute, muteRole, time_seconds, fn);
    }
}

/** COMMAND : unmuteUser
 * 
 * @description
 *   Unmutes the given user if they are muted.
 *   Optional muteRole argument if you wish to pass in your own mute role
 * 
 * @param { GuildMember } to_unmute 
 * @param { Role } muteRole 
 * 
 * @returns { boolean } unmute success? 
 * 
 */
export function unmuteUser(to_unmute: GuildMember, muteRole?: Role): boolean //Success?
{
    if (!muteRole) {
        let mute_role: Role | undefined = to_unmute.guild.roles.cache.find((role: Role) => role.name == 'muted');
        if (mute_role != undefined) {
            if (!to_unmute.roles.cache.find((role: Role) => role.id == mute_role!.id || role == mute_role)) return true; //if they dont have the role then its classified as a success
                to_unmute.roles.remove(mute_role);
                return true;
        } else {
            return false; // no 'muted' role exists
        }
    } else if ( muteRole && muteRole != undefined ) {
        if (!to_unmute.roles.cache.find((role: Role) => role.id == muteRole!.id || role == muteRole)) return true; //if they dont have the role then its classified as a success
            to_unmute.roles.remove(muteRole);
            return true;
    } else {
        return false;
    }
}

function muteTimeout(to_mute: GuildMember, muteRole: Role, time_seconds: number, fn?: () => void) {
    checkChannelPermissions(to_mute.guild, muteRole.id);
    to_mute.roles.add(muteRole);
    setTimeout(() => {
        if (to_mute.roles.cache.find((role: Role) => role == muteRole || role.id == muteRole.id) && (fn || fn != undefined)) {
            unmuteUser(to_mute, muteRole);
            fn();
        } else if (fn == undefined || !fn) {
            unmuteUser(to_mute, muteRole);
        }
    }, time_seconds*1000); 
}

function checkChannelPermissions(guild: Guild, muteRole_ID: string)
{
    [...guild.channels.cache.array()].forEach((channel: GuildChannel) => {
        channel.overwritePermissions([
            ...channel.permissionOverwrites.array(), 
            {
                type: 'role',
                id: muteRole_ID,
                deny: 'SEND_MESSAGES'
            }]
        );       
    })
}

export default {
    muteUser,
    unmuteUser
}