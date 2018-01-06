import {CreepType, Priority} from "../constants";
import {TaskDescriptor} from "../creeps/TaskDetails";

export interface EmpireRequest {
    priority: Priority;
}

export interface SpawnRequest extends EmpireRequest {
    type: CreepType;
    tasks?: Array<TaskDescriptor<any>>;
}

export enum WorkerJobType {
    BUILD,
    REPAIR,
    UPGRADE,
    REPLENISH_ENERGY
}

export interface WorkerJobRequest extends EmpireRequest {
    type: WorkerJobType;
}
