import { Guild, Role } from 'discord.js'
import { isID } from './isID'

export function getRole(access: string, guild: Guild, query: string): Role | undefined
{
    switch(access.toLowerCase())
    {
        case('id'):
            return isID(query) ? guild.roles.cache.find((role: Role) => role.id == query) : undefined;

        case('name'):
            return guild.roles.cache.find((role: Role) => role.name == query);
    }
}
