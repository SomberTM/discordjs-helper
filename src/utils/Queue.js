"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
var Queue = /** @class */ (function () {
    function Queue(array, length) {
        if (!array) {
            this.queue = [];
        }
        else {
            this.queue = array;
        }
        if (length) {
            this.max_length = length;
        }
    }
    Queue.prototype.enqueue = function (element) {
        if (!this.max_length) {
            this.queue.push(element);
            return;
        }
        if (this.queue.length <= this.max_length) {
            this.queue.push(element);
        }
    };
    Queue.prototype.dequeue = function () {
        return this.queue.shift();
    };
    Queue.prototype.peek = function () {
        return !this.isEmpty() ? this.queue[0] : undefined;
    };
    Queue.prototype.pop = function () {
        return !this.isEmpty() ? this.queue.pop() : undefined;
    };
    Queue.prototype.isEmpty = function () {
        return !this.queue.length;
    };
    Queue.prototype.size = function () {
        return this.queue.length;
    };
    Queue.prototype.maxIndex = function () {
        return this.size() - 1;
    };
    return Queue;
}());
exports.Queue = Queue;
