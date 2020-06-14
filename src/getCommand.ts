/** COMMAND : getCommand
 *  
 * @description
 *   Returns the command from the arguments
 * 
 * @param { string[] } args
 * 
 */

export function getCommand(args: string[]): string
{
    return args.shift()!.toLowerCase();
}