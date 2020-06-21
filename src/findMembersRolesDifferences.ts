import { GuildMember, Role } from 'discord.js';

/** COMMAND : findMembersRolesDiffernces
 * 
 * @description Finds the differnces in members roles.
 * ! Meant to be used in conjunction with the guildMemberUpdate listener !
 * 
 * @param { GuildMember } member_1 The first member
 * @param { GuildMember } member_2 The second member
 */

export function findMembersRolesDiffernces(member_1: GuildMember, member_2: GuildMember): Role[] {
    let oldRoles = [...member_1.roles.cache.values()];
    let newRoles = [...member_2.roles.cache.values()];

    oldRoles.sort((a: Role, b: Role) => { return (+a.id) - (+b.id) }).splice(0, 1); //Sort and remove @everyone
    newRoles.sort((a: Role, b: Role) => { return (+a.id) - (+b.id) }).splice(0, 1); //Sort and remove @everyone

    let larger: Role[] = oldRoles.length > newRoles.length ? oldRoles : newRoles;
    let smaller: Role[] = oldRoles.length < newRoles.length ? oldRoles : newRoles;

    let differences: Role[] = [];
    for (let i = 0; i < smaller.length; i++) {
        if (!smaller[i].equals(larger[i])) {
            differences.push(larger[i]);   
        }
    }

    if (!smaller.includes(larger[larger.length-1])) {
        differences.push(larger[larger.length-1]);
    }

    return differences;
}