import * as CreepActions from './helper.creep.actions';

/**
 * Spanws a Builder creep, using 300 energy.
 */
export const spawnSmall = (spawner: StructureSpawn, name: string) => {
    spawner.spawnCreep([MOVE, MOVE, CARRY, CARRY, WORK], name, {memory: {role: 'builder'}});
};

export const run = (creep: Creep) => {
    if (creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.say('Collecting energy.');
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
        delete creep.memory.resourceId; // Unset
        delete creep.memory.containerId;
        creep.say('🚧 Build!');
    }

    if (creep.memory.building) {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
    else {
        // 27,6
        CreepActions.pickupNearestEnergy(creep, creep.room.getPositionAt(27, 6));
        // let source: Resource;
        // let container: StructureContainer;
        // if (creep.memory.containerId) {
        //     container = Game.getObjectById(creep.memory.containerId);
        // }
        // if (creep.memory.resourceId) {
        //     source = Game.getObjectById(creep.memory.resourceId);
        // }
        // if (!source && !container) {
        //     let containers = creep.room.getPositionAt(27, 6).findInRange(FIND_STRUCTURES, 10, {
        //         filter: (structure) => {
        //             return (structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy > 100;
        //         }
        //     });
        //     if (containers.length > 0) {
        //         container = <StructureContainer>containers[0];
        //         creep.memory.containerId = container.id;
        //     } else { // Find dropped instead (containers not built yet?)
        //         let sources = creep.room.getPositionAt(27, 6).findInRange(FIND_DROPPED_RESOURCES, 10);
        //         if (sources.length == 0) {
        //             console.log("builder - No resources available");
        //             return; // No resources available
        //         }
        //         let sortedSources = _.sortBy(sources, (src) => {
        //             return src.amount
        //         });
        //         source = sortedSources[sortedSources.length - 1];
        //         // console.log(`Highest resource id: ${source.id}`);
        //         // source = creep.room.getPositionAt(27, 6).findClosestByPath(FIND_DROPPED_RESOURCES);
        //         creep.memory.resourceId = source.id;
        //     }
        // }
        // if (container) {
        //     if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
        //         creep.moveTo(container, {
        //             visualizePathStyle: {stroke: '#008ffa'},
        //             costCallback: (roomName, costMatrix) => {
        //                 let posList = PositionHelper.getAdjacentPositions(container.pos);
        //                 for (let pos in posList) {
        //                     costMatrix.set(posList[pos].x, posList[pos].y, 3);
        //                 }
        //                 return costMatrix
        //             }
        //         });
        //     }
        //     return;
        // }
        // if (creep.pickup(source) == ERR_NOT_IN_RANGE) {
        //     creep.moveTo(source, {
        //         visualizePathStyle: {stroke: '#ffaa00'},
        //         costCallback: (roomName, costMatrix) => {
        //             let posList = PositionHelper.getAdjacentPositions(source.pos);
        //             for (let pos in posList) {
        //                 costMatrix.set(posList[pos].x, posList[pos].y, 3);
        //             }
        //             return costMatrix
        //         }
        //     });
        // }
    }
};