export class Queue<T>
{
    readonly queue: T[];
    readonly max_length?: number;

    constructor(array?: T[], length?: number)
    {
        if (!array) { this.queue = [] }
        else { this.queue = array; }
        if (length) { this.max_length = length; }
    }

    public enqueue(element: T) {
        if (!this.max_length) { this.queue.push(element); return; }
        if (this.queue.length <= this.max_length) { this.queue.push(element); }
    }

    public dequeue(): T | undefined {
        return this.queue.shift();
    }

    public peek(): T | undefined {
        return !this.isEmpty() ? this.queue[0] : undefined;
    }

    public pop(): T | undefined {
        return !this.isEmpty() ? this.queue.pop() : undefined;
    }

    public isEmpty(): boolean {
        return !this.queue.length;
    }

    public size(): number {
        return this.queue.length;
    }

    public maxIndex(): number {
        return this.size()-1;
    }

}