import { Message, EmojiIdentifierResolvable, MessageReaction, User, PartialUser, MessageEmbed, Client } from 'discord.js'
import { helper } from './index'; 

export class pageReaction
{
    public readonly message!: Message;
    public readonly upArrowEmoji!: EmojiIdentifierResolvable;
    public readonly downArrowEmoji!: EmojiIdentifierResolvable;
    
    public readonly pages!: number;
    public readonly itemsPerPage!: number;
    private currentPageNumber!: number;
    private startingPage!: number;
    private rawItems!: any[];
    private formattedItems!: Array<Array<any>>;  
    private embedToEdit!: MessageEmbed;

    constructor(messageToReactTo: Message, items: any[], itemsPerPage: number, startingPage?: number)
    {
        if (!messageToReactTo.embeds || !messageToReactTo.embeds[0]) { console.log(`[WARN]: This class only works on messages with embeds`); return <pageReaction><unknown> undefined; } else {

            this.message = messageToReactTo;
            this.embedToEdit = this.message.embeds[0];

            this.upArrowEmoji = '🔼';
            this.downArrowEmoji = '🔽';

            this.pages = items.length / itemsPerPage;
            this.startingPage = startingPage ? startingPage : 1;
            this.currentPageNumber = this.startingPage;
            this.itemsPerPage = itemsPerPage;
            this.rawItems = items;
            this.formattedItems = this.formatItems();
            
            this.embedToEdit.setDescription(this.formattedItems[this.startingPage > 0 ? this.startingPage-1 : 0].map((item: any) => item));
            this.message.edit(this.embedToEdit);

            this.message.react(this.upArrowEmoji);
            this.message.react(this.downArrowEmoji);

            helper.emit('pageReactionCreate', this);
        }
        
    }

    public updateAdd(messageReaciton: MessageReaction, user: User)
    {
        if (user.bot) return;

        let mrEmoji: string = messageReaciton.emoji.toString();
        let mrID: string = messageReaciton.message.id;
        
        if (mrEmoji == this.upArrowEmoji.toString() && mrID == this.message.id ) {
            if (this.currentPageNumber > 0) {
                this.currentPageNumber--;
                this.embedToEdit.setDescription(this.formattedItems[this.currentPageNumber-1].map((item: any) => item));
                this.message.edit(this.embedToEdit);
            }
        } 

        if (mrEmoji == this.downArrowEmoji.toString() && mrID == this.message.id) {
            if (this.currentPageNumber < this.pages) {
                this.currentPageNumber++;
                this.embedToEdit.setDescription(this.formattedItems[this.currentPageNumber-1].map((item: any) => item));
                this.message.edit(this.embedToEdit);
            }
        }
    }

    public updateRemove(messageReaciton: MessageReaction, user: User) {
        if (user.bot) return;

        let mrEmoji: string = messageReaciton.emoji.toString();
        let mrID: string = messageReaciton.message.id;
        
        if (mrEmoji == this.upArrowEmoji.toString() && mrID == this.message.id ) {
            if (this.currentPageNumber > 0) {
                this.currentPageNumber--;
                this.embedToEdit.setDescription(this.formattedItems[this.currentPageNumber-1].map((item: any) => item));
                this.message.edit(this.embedToEdit);
            } 
        } 

        if (mrEmoji == this.downArrowEmoji.toString() && mrID == this.message.id) {
            if (this.currentPageNumber < this.pages) {
                this.currentPageNumber++;
                this.embedToEdit.setDescription(this.formattedItems[this.currentPageNumber-1].map((item: any) => item));
                this.message.edit(this.embedToEdit);
            }
        }
    }

    private formatItems(): Array<Array<any>>
    {
        let formatted: Array<Array<any>> = [];
        for (let i = 0; i < this.pages; i++) { formatted.push([]); }
        let j: number = 1;
        for (let i = 0; i < this.rawItems.length; i++) {
            if ( i >= j * this.itemsPerPage) {
                j++;
            }
            formatted[j-1].push(this.rawItems[i]);
        }
        return formatted;
    }

}