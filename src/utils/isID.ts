export function isID(id: string): boolean
{
    return id.match(/([0-9])+/g) ? true : false;
}