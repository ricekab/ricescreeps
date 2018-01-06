import {CreepType} from "../constants";
import {Requests} from "../empire/Requests";
import {WorkerJobRequest, WorkerJobType} from "../empire/RequestType";
import {Logger} from "../utils/Logger";
import {TaskDescriptor} from "./TaskDetails";
import {CreepTask} from "./TaskEnum";
import {PERFORM_TASK} from "./Tasks";

export class CreepManager {

    /**
     * Set the creep's current task to the next task in the creep's task stack. If no tasks are in the stack,
     * a new job is generated for the creep from which a new stack of tasks are generated.
     *
     * By default, this will execute the newly set task on this tick unless startNow is set to false.
     *
     * This is generally favourable as the game state doesn't update even if actions are queued,
     * eg. build depletes the energy "between" ticks.
     */
    public static cycleTask(creep: Creep, startNow: boolean = true) {
        if (!creep.memory.taskStack) {
            creep.memory.taskStack = [];
        }
        if (creep.memory.taskStack.length > 0) {
            const stack = creep.memory.taskStack;
            const nextTask = stack.pop() as TaskDescriptor<any>;
            creep.memory.state = nextTask.state;
            creep.memory.task = nextTask.task;
            if (startNow) {
                PERFORM_TASK(creep, nextTask.state);
            }
        } else {
            const job = CreepManager.getNextJob(creep);
            creep.memory.taskStack = CreepManager.generateTasks(job);
            CreepManager.cycleTask(creep, startNow);
        }
    }

    /** TODO: Return a STACK of task descriptors */
    // TODO: Define job types
    public static generateTasks<T>(job: WorkerJobRequest): Array<TaskDescriptor<any>> {
        switch (job.type) {
            case WorkerJobType.BUILD:
                break;
            case WorkerJobType.REPLENISH_ENERGY:
                break;
            case WorkerJobType.UPGRADE:
                break;
            case WorkerJobType.REPAIR:
                break;
        }
        return [];
    }

    public static getNextJob(creep: Creep): WorkerJobRequest {
        switch (creep.memory.type) {
            case CreepType.WORKER:
                return Requests.retrieveNextWorkerRequest();
            default:
                Logger.ERR_NOTIFY(`Type "${creep.memory.type} not recognized for job retrieval.`);
                throw new Error(`Type "${creep.memory.type} not recognized for job retrieval.`);
        }
    }

    /**
     * TODO: DOC
     */
    public static update(creep: Creep) {
        // TODO: This should be managed by the miner's parent (ie. the mine flag)
        // switch (creep.memory.type) {
        //     case CreepType.MINER:
        //         let threshold = creep.memory.ticksToLiveThreshold;
        //         if (threshold && threshold <= creep.ticksToLive) {
        //             // TODO: Request replacement
        //             delete creep.memory.ticksToLiveThreshold; // Delete means it won't duplicate request
        //         }
        //         return;
        // }
        return;
    }

    public static run(creep: Creep) {
        if (!creep.memory.state) {
            creep.memory.state = creep.spawning ? CreepTask.SPAWN : CreepTask.IDLE;
        }
        PERFORM_TASK(creep, creep.memory.state);
    }

}
