import path from 'path';
import fs from 'fs';
import { type } from 'os';

export type registryType =  {
    ts: string,
    js: string,
    javascript: string,
    typescript: string
}
export const registryTypes: registryType = {
    ts: '.ts',
    js: '.js',
    javascript: '.js',
    typescript: '.ts'
}

export class commandRegistry {

    private registryPath: string;
    private registryType: string;
    commands: any[];

    /**
     * @constructor
     * @param commandFolderPath The path to the folder where commands are held
     * @param type The type of files to read either '.js' or '.ts'
     */
    constructor(abosluteCommandFolderPath: string, type: string) {
        //If the path is absolute no need to use join. If its relative, join the directory to the given folder path
        this.registryPath = path.isAbsolute(abosluteCommandFolderPath) ? abosluteCommandFolderPath : ``; if (this.registryPath == ``) throw `Invalid path provided`;
        this.registryType = type;
        this.commands = [];
        this.initializeRegistry();
    }

    /**
     * Set the registry path and re-initialize the registry
     */
    set path(new_path: string) {
        this.registryPath=new_path;
        this.initializeRegistry();
    }

    /**
     * Set the registry type and re-intialize the registry
     */
    set type(type: string) {
        this.registryType = type;
        this.initializeRegistry();
    }

    private initializeRegistry() {
        const commandFiles: string[] = fs.readdirSync(this.registryPath).filter(file => file.endsWith('.js'));
        if (this.registryType == registryTypes.js) {
            for (const file of commandFiles) {
                const command = require(path.join(this.registryPath, file));

                if (!command.name) throw `Export needs name: <string> property\n--Help--\nmodule.exports = {\n    name: 'example'\n}`

                let formatted: any = {};
                formatted[command.name] = command;

                this.commands.push(formatted);
            }
        } else if (this.registryType == registryTypes.ts) {
            for (const file of commandFiles) {
                const command = require(path.join(this.registryPath, file)).default;

                if (!command.name) throw `Export needs name: <string> property\n--Help--\nmodule.exports = {\n    name: 'example'\n}`

                let formatted: any = {};
                formatted[command.name] = command;

                this.commands.push(formatted);
            }           
        }
    }

    /** gets a command file based off of the name paramater
     * 
     * @param { string } commandName The name attribute of a certain command file
     */
    public get(commandName: string): any {
        if (!this.commands.length || this.commands.length == 0) return undefined;
        for (const command of this.commands) {
            return command[commandName];
        }
    }

    /** grabs a function from one of the read command files
     * 
     * @param { string } commandName The name attribute of a certain command file
     * @param { string } functionName The name of the function inside the given command file
     * 
     * @returns the found function
     */
    public grab(commandName: string, functionName: string): Function {
        for (const command of this.commands) {
            return command[commandName][functionName];
        }
        throw `Couldn't find '${functionName}' in '${commandName}'`
    }

    /** grabs a function from one of the read command files
     * 
     * @param { string } commandName The name attribute of a certain command file
     * @param { string } functionName The name of the function inside the given command file
     * 
     * @returns the found function
     */
    public grabFunction(commandName: string, functionName: string): Function {
        return this.grab(commandName, functionName);
    }

    /**
     * Empties the commands array
     */
    public empty() {
        this.commands = [];
    }

    /**
     * Returns as a boolean, whether the reigstry is empty or not
     */
    public isEmpty(): boolean {
        return this.commands.length == 0 || !this.commands.length;
    }

    /**
     * Returns all the commands known to this registry
     */
    public getRegistry(): any[] {
        return this.commands;
    }

    /**
     * Returns a new commandRegistry instance with the same properties as this one
     */
    public clone(): commandRegistry {
        return new commandRegistry(this.registryPath, this.registryType);
    }

    /** Sets the commands of this registry to an array or sets the entire registry to another
     * 
     * @param { any[] | commandRegistry } registry An array of commands or another commandRegistry instance 
     */
    public set(registry: any[] | commandRegistry) {
        if (Array.isArray(registry)) {
            this.commands = registry;
        } else if (typeof registry == typeof commandRegistry) {
            this.commands = registry.commands;
            this.path = registry.registryPath;
            this.type = registry.type;
        }
    }

}