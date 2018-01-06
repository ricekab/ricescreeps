import {TaskDescriptor} from "./creeps/TaskDetails";
import {CreepTask} from "./creeps/TaskEnum";

/* PERIODICITY OF CERTAIN ACTIONS */
export const CLEAN_MEMORY_PERIOD = 4;
export const ROOM_UPDATE_PERIOD = 5;               // How many ticks between state updates
export const ROOM_UPDATE_HISTORY_SIZE = 5;         // How many updates to keep
export const EMPIRE_UPDATE_PERIOD = ROOM_UPDATE_PERIOD;
export const EMPIRE_UPDATE_HISTORY_SIZE = 50;
export const EMPIRE_RUN_PERIOD = 5;                 // How many ticks between empire ai runs

/* VERSIONS */
export class VERSIONS {
    public static ROOM_MEM = 1;
    public static EMPIRE_MEM = 1;
    public static FLAG_MEM = 1;
}

/* ENERGY_COSTS (not worst case costs, ie. towers are typically more expensive (up to 20 times)*/
export const RAMPART_UPKEEP_COST = RAMPART_DECAY_AMOUNT / RAMPART_DECAY_TIME * REPAIR_COST;
export const ROAD_UPKEEP_COST = ROAD_DECAY_AMOUNT / ROAD_DECAY_TIME * REPAIR_COST;
export const CONTAINER_UPKEEP_COST = CONTAINER_DECAY / CONTAINER_DECAY_TIME * REPAIR_COST;

/* TYPES */
export enum CreepType {
    HAULER = "hauler",
    WORKER = "worker",
    MINER = "miner"
}

export enum RoomType {
    MAIN = "main",
    REMOTE = "remote"
}

export enum FlagType {
    MINE = "mine"
}

export enum Priority {
    CRITICAL = "CRIT",
    HIGH = "HIGH",
    NORMAL = "NORM",
    LOW = "LOW",
    MINIMAL = "MIN",
    NONE = "NONE"
}

// TODO: Priority.NONE is not included.
export const PRIORITY_LIST: Priority[] = [
    Priority.CRITICAL, Priority.HIGH, Priority.NORMAL, Priority.LOW, Priority.MINIMAL
];

export interface RiceCreepMemory extends CreepMemory {
    type: CreepType;
    state: CreepTask;
    taskStack: Array<TaskDescriptor<any>>;
}
