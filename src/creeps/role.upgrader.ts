import * as CreepActions from './helper.creep.actions';

/**
 * Spanws a Upgrader creep, using 300 energy.
 */
export const spawnSmall = (spawner: StructureSpawn, name: string) => {
    spawner.spawnCreep([MOVE, MOVE, CARRY, CARRY, CARRY, WORK], name, {memory: {role: 'upgrader'}});
};

export const run = (creep: Creep) => {
    if (creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
        creep.say('Collecting 🗲');
    }
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
        creep.say('🚧 upgrade');
    }

    if (creep.memory.upgrading) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
    else {
        CreepActions.pickupNearestEnergy(creep);
        // let source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        // if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
        //     creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        // }
    }
};