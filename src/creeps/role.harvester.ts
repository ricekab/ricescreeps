import * as CreepActions from './helper.creep.actions';

export const spawnHarvester = (spawner: StructureSpawn, maxEnergy: number, name: string, priority: number) => {
    if (priority < 3) {
        if (spawnMinimal(spawner, name) == OK) {
            return;
        }
    } else { // Not high priority
        spawnSmall(spawner, name);
    }
};

/**
 * Spawns a Harvester creep, using 100 energy.
 */
export const spawnMinimal = (spawner: StructureSpawn, name: string): ScreepsReturnCode => {
    return spawner.spawnCreep([MOVE, CARRY], name, {memory: {role: 'harvester'}});
};

/**
 * Spawns a Harvester creep, using 300 energy.
 */
export const spawnSmall = (spawner: StructureSpawn, name: string): ScreepsReturnCode => {
    return spawner.spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY], name, {memory: {role: 'harvester'}});
};

export const run = (creep: Creep) => {
    if (creep.carry.energy < creep.carryCapacity / 2) {
        CreepActions.pickupNearestEnergy(creep);
        // let sources = creep.room.find(FIND_SOURCES);
        // if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        //     creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        // }
        // let source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        // if (creep.pickup(source) == ERR_NOT_IN_RANGE) {
        //     creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        // }
    }
    else {
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};