import { Message, EmojiIdentifierResolvable, MessageReaction, User, PartialUser, MessageEmbed } from 'discord.js'
import { threadId } from 'worker_threads';

export class pageReaction
{

    public readonly message!: Message;
    private readonly upArrowEmoji!: EmojiIdentifierResolvable;
    private readonly downArrowEmoji!: EmojiIdentifierResolvable;
    
    private pages!: number;
    private currentPageNumber!: number;
    private startingPage!: number;
    private rawItems!: any[];
    private formattedItems!: Array<Array<any>>;
    private itemsPerPage!: number;
    private embedToEdit!: MessageEmbed;

    constructor(messageToReactTo: Message, items: any[], itemsPerPage: number, startingPage?: number)
    {
        if (!messageToReactTo.embeds || !messageToReactTo.embeds[0]) { console.log(`[WARN]: This class only works on messages with embeds`); return <pageReaction><unknown> undefined; } else {

            this.message = messageToReactTo;
            this.embedToEdit = this.message.embeds[0];

            this.upArrowEmoji = '🔼';
            this.downArrowEmoji = '🔽';

            this.pages = items.length / itemsPerPage;
            this.startingPage = startingPage ? startingPage : 0;
            this.currentPageNumber = this.startingPage;
            this.itemsPerPage = itemsPerPage;
            this.rawItems = items;
            this.formattedItems = this.formatItems();
            
            this.embedToEdit.setDescription(this.formattedItems[this.startingPage > 0 ? this.startingPage-1 : 0].map((item: any) => item));
            this.message.edit(this.embedToEdit);

            this.message.react(this.upArrowEmoji);
            this.message.react(this.downArrowEmoji);

            console.log(this.pages)

            this.update();

        }
    }

    private update()
    {
        this.message.client.on('messageReactionAdd', (messageReaciton: MessageReaction, user: User | PartialUser) => {
            if (user.bot) return;

            let mrEmoji: string = messageReaciton.emoji.toString();
            let mrID: string = messageReaciton.message.id;
            
            if (mrEmoji == this.upArrowEmoji.toString() && mrID == this.message.id ) {
                //console.log(`Up arrow reacted to`);
                if (this.currentPageNumber > 0) {
                    this.currentPageNumber--;
                    this.checkZero();
                    this.embedToEdit.setDescription(this.formattedItems[this.currentPageNumber-1].map((item: any) => item));
                    this.message.edit(this.embedToEdit);
                } else {
                    this.checkZero();
                }
            } 

            if (mrEmoji == this.downArrowEmoji.toString() && mrID == this.message.id) {
                //console.log(`Down arrow reacted to`);
                if (this.currentPageNumber < this.pages) {
                    this.currentPageNumber++;
                    this.embedToEdit.setDescription(this.formattedItems[this.currentPageNumber-1].map((item: any) => item));
                    this.message.edit(this.embedToEdit);
                }
            }
        });

        this.message.client.on('messageReactionRemove', (messageReaciton: MessageReaction, user: User | PartialUser) => {
            if (user.bot) return;

            let mrEmoji: string = messageReaciton.emoji.toString();
            let mrID: string = messageReaciton.message.id;
            
            if (mrEmoji == this.upArrowEmoji.toString() && mrID == this.message.id ) {
                //console.log(`Up arrow reacted to`);
                if (this.currentPageNumber > 0) {
                    this.currentPageNumber--;
                    this.checkZero();
                    this.embedToEdit.setDescription(this.formattedItems[this.currentPageNumber-1].map((item: any) => item));
                    this.message.edit(this.embedToEdit);
                } else {
                    this.checkZero();
                }
            } 

            if (mrEmoji == this.downArrowEmoji.toString() && mrID == this.message.id) {
                //console.log(`Down arrow reacted to`);
                if (this.currentPageNumber < this.pages) {
                    this.currentPageNumber++;
                    this.embedToEdit.setDescription(this.formattedItems[this.currentPageNumber-1].map((item: any) => item));
                    this.message.edit(this.embedToEdit);
                }
            }
        });
    }

    private checkZero()
    {
        if (this.currentPageNumber <= 0) {
            this.currentPageNumber = 1;
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
        //console.log(formatted);
        return formatted;
    }

}