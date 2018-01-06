import {Priority, PRIORITY_LIST} from "../constants";

export interface PriorityQueueObj {
    [queue: number]: any[];
}

export class PriorityQueueUtil {

    public static createQueue(): PriorityQueueObj {
        const result: PriorityQueueObj = {};
        _.forEach(PRIORITY_LIST, (priorityLevel) => result[priorityLevel] = []);
        return result;
    }

    /** Returns next request in queue without removing it. */
    public static peek(priorityQueue: PriorityQueueObj) {
        for (let priority in PRIORITY_LIST) {
            if (priorityQueue[priority].length > 0) {
                return priorityQueue[priority][0];
            }
        }
        throw new Error("No requests in queue. Should return a null request?");
    }

    /** Moves the item from the front of the queue to the back and returns it. */
    public static cycle(priorityQueue: PriorityQueueObj) {
        for (let priority in PRIORITY_LIST) {
            if (priorityQueue[priority].length > 0) {
                const item = priorityQueue[priority].shift();
                priorityQueue[priority].push(item);
                return item;
            }
        }
        throw new Error("No requests in queue. Should return a null request?");
    }

    /**
     * Inserts a value into the layered priority queue with the corresponding priority. It is inserted in the back
     * of that particular queue.
     *
     * This mutates the provided priorityQueue.
     */
    public static insert(priorityQueue: PriorityQueueObj, value: any, priority: Priority) {
        priorityQueue[priority].push(value);
        return priorityQueue;
    }

    /**
     * Changes the given item from one priority level to another. If the supplied priorities are the same, no movement
     * is performed.
     *
     * The given item will be removed from the old queue. If the given item cannot be found in the old queue,
     * it is placed into the new queue without modifications to the old queue.
     *
     * NOTE: Passing the old priority speeds this up quite a lot since the queue doesn't have to be traversed
     * to search for it.
     */
    public static changePriority(pqObject: PriorityQueueObj, item: any, newPriority: string, oldPriority?: string) {
        if (newPriority === oldPriority) {
            return;
        }
        if (!oldPriority) {
            oldPriority = PriorityQueueUtil.findPriority(pqObject, item);
        }
        PriorityQueueUtil.remove(pqObject, item, oldPriority);
        pqObject[newPriority].push(item);
    }

    public static remove(priorityQueue: PriorityQueueObj, item: any, priority?: string) {
        if (!priority) {
            priority = PriorityQueueUtil.findPriority(priorityQueue, item);
        }
        const queue: any[] = priorityQueue[priority];
        const index = _.findIndex(queue, item);
        if (index >= 0) {
            queue.splice(index, 1);
        }
    }

    /**
     * Searches the priority queues for the given item. Returns which priority the item resides in.
     *
     * If no match is found, return Priority.NONE
     */
    private static findPriority(priorityQueue: PriorityQueueObj, item: any): string {
        for (let priority in PRIORITY_LIST) {
            if (_.contains(priorityQueue[priority], item)) {
                return priority;
            }
        }
        return Priority.NONE;
    }
}
