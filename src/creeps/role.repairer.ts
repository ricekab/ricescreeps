import * as _ from "lodash";
import * as CreepActions from './helper.creep.actions';

export const spawnRepairer = (spawner: StructureSpawn, maxEnergy: number, name: string, priority: number) => {
    if (priority < 1) {
        if (spawnSmall(spawner, name) == OK) {
            return;
        }
        if (spawnMinimal(spawner, name) == OK) {
            return;
        }
    } else { // Not high priority
        spawnSmall(spawner, name);
    }
};

export const spawnMinimal = (spawner: StructureSpawn, name: string): ScreepsReturnCode => {
    return spawner.spawnCreep([MOVE, CARRY, WORK], name, {memory: {role: 'repairer'}});
};

export const spawnSmall = (spawner: StructureSpawn, name: string): ScreepsReturnCode => {
    return spawner.spawnCreep([MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK], name, {memory: {role: 'repairer'}});
};

export const run = (creep: Creep) => {
    if (creep.carry.energy == 0) {
        delete creep.memory.repairTargetId;
        CreepActions.pickupNearestEnergy(creep);
        // let sources = creep.room.find(FIND_SOURCES);
        // if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        //     creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        // }
        // let source: Resource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        //
        // if(creep.memory.sourceId){
        //     source = Game.getObjectById(creep.memory.sourceId);
        // } else {
        //     source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        //     creep.memory.sourceId = source.id;
        // }
        // if (creep.pickup(source) == ERR_NOT_IN_RANGE) {
        //     creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        // }
    }
    else {
        // delete creep.memory.sourceId;
        let repairTarget;
        if (creep.memory.repairTargetId) {
            repairTarget = Game.getObjectById(creep.memory.repairTargetId);
        } else {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.hits < structure.hitsMax / 2)
                }
            });
            if (targets.length > 0) {
                targets = _.sortBy(targets, (trg) => trg.hits);
                creep.memory.repairTargetId = targets[0].id;
                repairTarget = targets[0];
            }
        }
        let repairResult: ScreepsReturnCode = creep.repair(repairTarget);
        if (repairResult == ERR_NOT_IN_RANGE) {
            creep.moveTo(repairTarget, {visualizePathStyle: {stroke: '#8800ff'}});
        }
        if (repairTarget.hits == repairTarget.hitsMax) {
            delete creep.memory.repairTargetId;
        }
    }
};