import {Priority} from "../constants";
import {Logger} from "../utils/Logger";
import {PriorityQueueObj, PriorityQueueUtil} from "../utils/PriorityQueueUtil";
import {EmpireRequest, SpawnRequest, WorkerJobRequest} from "./RequestType";

export class Requests {
    public static getRequestById(requestId: string): EmpireRequest {
        return Memory.empire.requests[requestId];
    }

    public static retrieveNextWorkerRequest(): WorkerJobRequest {
        return Requests.getRequestById(PriorityQueueUtil.cycle(Memory.empire.workerJobQueue)) as WorkerJobRequest;
    }

    public static retrieveNextSpawnRequest<T>(): SpawnRequest {
        return Requests.getRequestById(PriorityQueueUtil.cycle(Memory.spawn.spawnQueue)) as SpawnRequest;
    }

    public static updatePriority(requestId: string, request: EmpireRequest, newPriority: Priority) {
        const oldPriority = request.priority;
        if (newPriority !== oldPriority) {
            request.priority = newPriority;
            PriorityQueueUtil.changePriority(Memory.empire.workerJobQueue, requestId, newPriority, oldPriority);
        }
    }

    /** Returns the request object after submission for chaining. */
    public static submitWorkerJobRequest(requestId: string, req: WorkerJobRequest) {
        return Requests.submit(Memory.empire.workerJobQueue, requestId, req);
    }

    /** Returns the request object after submission for chaining. */
    public static submitSpawnRequest<T>(requestId: string, req: SpawnRequest) {
        const pq: PriorityQueueObj = Memory.empire.spawnQueue;
        return Requests.submit(pq, requestId, req);
    }

    /** Returns the request object after submission for chaining. */
    private static submit(priorityQueue: PriorityQueueObj, requestId: string, req: EmpireRequest) {
        const requestMap = Memory.empire.requests;
        if (requestMap[requestId]) {
            Logger.ERR_NOTIFY(`[Requests] Possible duplicate submission deteced with id "${requestId}"`);
        }
        requestMap[requestId] = req;
        PriorityQueueUtil.insert(priorityQueue, requestId, req.priority);
        return req;
    }
}
