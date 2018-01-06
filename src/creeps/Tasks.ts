import {Logger} from "../utils/Logger";
import {CreepManager} from "./CreepManager";
import {MoveToDetails, PositionDetails, ResourceDetails, TargetIdDetails, TargetResourceDetails} from "./TaskDetails";
import {CreepTask} from "./TaskEnum";

const _TASK_MAP = new Map<CreepTask, (Creep) => any>();

export const PERFORM_TASK = (creep: Creep, type: CreepTask): any => {
    return _TASK_MAP.get(type)(creep);
};

/** HELPER FUNCTIONS */
const creepIsEmpty = (creep: Creep, resource: ResourceConstant = RESOURCE_ENERGY) => creep.carry[resource] <= 0;
const creepIsFull = (creep: Creep) => _.sum(creep.carry) === creep.carryCapacity;

/** Target is creep or structure but we can't type it here. */
const targetIsFull = (target): boolean => {
    const type = target.structureType;
    if (!type) { // === Creep
        return _.sum(target.carry) === target.carryCapacity;
    }
    if (type === STRUCTURE_STORAGE || type === STRUCTURE_CONTAINER || type === STRUCTURE_TERMINAL) {
        return _.sum(target.store) === target.storeCapacity;
    } // ELSE: Energy carrying structures
    return target.energy === target.energyCapacity;
};

class TaskImpl {
    /** Retrieve task memory as a given type. Does NOT type check! */
    public static getTaskDetails<T>(creep: Creep): T {
        return creep.memory.task as T;
    }

    public static setTaskDetails<T>(creep: Creep, details: T) {
        creep.memory.task = details;
    }

    public static spawn(creep: Creep) {
        if (!creep.spawning) {
            CreepManager.cycleTask(creep);
        }
    }

    public static idle(creep: Creep) {
        CreepManager.cycleTask(creep);
    }

    public static moveTo(creep: Creep) {
        const details = this.getTaskDetails<MoveToDetails>(creep);
        const targetPos = new RoomPosition(details.x, details.y, details.roomName);
        const inRange = details.range;
        if (creep.pos.getRangeTo(targetPos) <= inRange) {
            return CreepManager.cycleTask(creep);
        }
        creep.moveTo(targetPos);
    }

    public static moveOn(creep: Creep) {
        const details = this.getTaskDetails<PositionDetails>(creep);
        const targetPos = new RoomPosition(details.x, details.y, details.roomName);
        if (creep.pos.isEqualTo(targetPos)) {
            return CreepManager.cycleTask(creep);
        }
        creep.moveTo(targetPos);
    }

    public static build(creep: Creep) {
        const details = this.getTaskDetails<TargetIdDetails>(creep);
        const target = Game.getObjectById<ConstructionSite>(details.targetId);
        if (creepIsEmpty(creep) || !target) {
            return CreepManager.cycleTask(creep);
        }
        switch (creep.build(target)) {
            case OK:
                return;
            case ERR_NOT_IN_RANGE:
                Logger.ERR_NOTIFY("[TaskImpl.build] ERROR: Not in range.");
                return;
            default:
                Logger.ERR_NOTIFY("[TaskImpl.build] ERROR: Unhandled exception.");
                return;
        }
    }

    public static repair(creep: Creep) {
        const details = this.getTaskDetails<TargetIdDetails>(creep);
        const target = Game.getObjectById<Structure>(details.targetId);
        if (creepIsEmpty(creep) || !target || target.hits === target.hitsMax) {
            return CreepManager.cycleTask(creep);
        }
        switch (creep.repair(target)) {
            case OK:
                return;
            case ERR_NOT_IN_RANGE:
                Logger.ERR_NOTIFY("[TaskImpl.repair] ERROR: Not in range.");
                return;
            default:
                Logger.ERR_NOTIFY("[TaskImpl.repair] ERROR: Unhandled exception.");
                return;
        }
    }

    public static harvest(creep: Creep) {
        const details = this.getTaskDetails<TargetIdDetails>(creep);
        const target = Game.getObjectById<Source | Mineral>(details.targetId);
        if (creepIsFull(creep)) {
            return CreepManager.cycleTask(creep);
        }
        switch (creep.harvest(target)) {
            case OK:
                return;
            case ERR_NOT_IN_RANGE:
                Logger.ERR_NOTIFY("[TaskImpl.harvest] ERROR: Not in range.");
                return;
            default:
                Logger.ERR_NOTIFY("[TaskImpl.harvest] ERROR: Unhandled exception.");
                return;
        }
    }

    /** Mine is an indefinite version of harvest intended for dedicated miners. */
    public static mine(creep: Creep) {
        const details = this.getTaskDetails<TargetIdDetails>(creep);
        const target = Game.getObjectById<Source | Mineral>(details.targetId);
        switch (creep.harvest(target)) {
            case ERR_NOT_ENOUGH_RESOURCES:
                Logger.CONSOLE("[TaskImpl.mine] Target mine is empty.");
                return;
            default:
                Logger.ERR_NOTIFY("[TaskImpl.mine] CRITICAL ERROR: Unhandled exception.");
        }
    }

    public static withdraw(creep: Creep) {
        const details = this.getTaskDetails<TargetResourceDetails>(creep);
        const target = Game.getObjectById<Structure>(details.targetId);
        if (creepIsFull(creep)) {
            return CreepManager.cycleTask(creep);
        }
        if (!target) {
            // TODO: Target no longer exists --> Find replacement task or just cycle?
        }
        const responseCode = details.amount ?
            creep.withdraw(target, details.resourceType, details.amount) :
            creep.withdraw(target, details.resourceType);
        switch (responseCode) {
            case OK:
                return;
            case ERR_NOT_IN_RANGE:
                Logger.ERR_NOTIFY("[TaskImpl.withdraw] ERROR: Not in range.");
                return;
            default:
                Logger.ERR_NOTIFY("[TaskImpl.withdraw] ERROR: Unhandled exception.");
                return;
        }
    }

    public static transfer(creep: Creep) {
        const details = this.getTaskDetails<TargetResourceDetails>(creep);
        const target = Game.getObjectById<Creep | Structure>(details.targetId);
        if (creepIsEmpty(creep) || !target || targetIsFull(target)) {
            return CreepManager.cycleTask(creep);
        }
        const responseCode = details.amount ?
            creep.transfer(target, details.resourceType, details.amount) :
            creep.transfer(target, details.resourceType);
        switch (responseCode) {
            case OK:
                return;
            case ERR_NOT_IN_RANGE:
                Logger.ERR_NOTIFY("[TaskImpl.transfer] ERROR: Not in range.");
                return;
            default:
                Logger.ERR_NOTIFY("[TaskImpl.transfer] ERROR: Unhandled exception.");
                return;
        }
    }

    public static upgrade(creep: Creep) {
        const details = this.getTaskDetails<TargetIdDetails>(creep);
        const target = Game.getObjectById<StructureController>(details.targetId);
        if (creepIsEmpty(creep)) {
            return CreepManager.cycleTask(creep);
        }
        if (!target.my) {
            Logger.ERR_NOTIFY("[TaskImpl.upgrade] ERROR: Controller no longer owned.");
            // TODO: What to do with lost controller?
            return;
        }
        switch (creep.upgradeController(target)) {
            case OK:
                return;
            case ERR_NOT_IN_RANGE:
                Logger.ERR_NOTIFY("[TaskImpl.upgrade] ERROR: Not in range.");
                return;
            default:
                Logger.ERR_NOTIFY("[TaskImpl.upgrade] ERROR: Unhandled exception.");
                return;
        }
    }

    public static pickUp(creep: Creep) {
        const details = this.getTaskDetails<TargetIdDetails>(creep);
        const target = Game.getObjectById<Resource>(details.targetId);
        if (creepIsFull(creep)) {
            return CreepManager.cycleTask(creep);
        }
        if (!target) {
            // TODO: Target no longer exists --> Find replacement task or just cycle?
        }
        switch (creep.pickup(target)) {
            case OK:
                return;
            case ERR_NOT_IN_RANGE:
                Logger.ERR_NOTIFY("[TaskImpl.pickup] ERROR: Not in range.");
                return;
            default:
                Logger.ERR_NOTIFY("[TaskImpl.pickup] ERROR: Unhandled exception.");
                return;
        }
    }

    public static drop(creep: Creep) {
        const details = this.getTaskDetails<ResourceDetails>(creep);
        details.amount ? creep.drop(details.resourceType, details.amount) : creep.drop(details.resourceType);
    }
}

// Mapping function implementations to their respective state enumeration
_TASK_MAP.set(CreepTask.SPAWN, TaskImpl.spawn);
_TASK_MAP.set(CreepTask.IDLE, TaskImpl.idle);
_TASK_MAP.set(CreepTask.MOVE_TO, TaskImpl.moveTo);
_TASK_MAP.set(CreepTask.MOVE_ON, TaskImpl.moveOn);
_TASK_MAP.set(CreepTask.BUILD, TaskImpl.build);
_TASK_MAP.set(CreepTask.REPAIR, TaskImpl.repair);
_TASK_MAP.set(CreepTask.HARVEST, TaskImpl.harvest);
_TASK_MAP.set(CreepTask.MINE, TaskImpl.mine);
_TASK_MAP.set(CreepTask.WITHDRAW, TaskImpl.withdraw);
_TASK_MAP.set(CreepTask.TRANSFER, TaskImpl.transfer);
_TASK_MAP.set(CreepTask.UPGRADE, TaskImpl.upgrade);
_TASK_MAP.set(CreepTask.PICK_UP, TaskImpl.pickUp);
_TASK_MAP.set(CreepTask.DROP, TaskImpl.drop);

/**
 * Generate a task list to retrieve energy for the given creep. It will prioritize storage/containers first before
 * dropped resources. If none can be found the creep will attempt to mine it himself.
 */
export const retrieveEnergy = (creep: Creep) => {
    throw new Error("Not implemented");
};
