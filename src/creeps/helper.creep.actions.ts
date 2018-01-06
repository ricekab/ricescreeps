import * as _ from "lodash";
import * as PositionHelper from "../helper.position";

/**
 * Retrieve the nearest energy from storage or the ground.
 *
 * Sets the creep's targetId and targetType in memory.
 */
export const pickupNearestEnergy = (creep: Creep, posOrigin?: RoomPosition) => {
    let searchOrigin: RoomPosition = posOrigin || creep.pos;
    let target;
    let targetType: string;
    if (creep.memory.targetId) {
        target = Game.getObjectById(creep.memory.targetId);
        targetType = creep.memory.targetType;
    }
    if (!target) {
        let newTarget = getNearestTarget(creep, searchOrigin);
        if (newTarget == null) {
            console.log(`[ERROR] helper.creep.actions - Couldn't find any suitable targets.`);
            return;
        }
        target = Game.getObjectById(newTarget.id);
        targetType = newTarget.type;
    }
    let result: ScreepsReturnCode;
    switch (targetType) {
        case STRUCTURE_CONTAINER:
            result = creep.withdraw(target, RESOURCE_ENERGY);
            break;
        case RESOURCE_ENERGY:
            result = creep.pickup(target);
            break;
        default:
            console.log(`[ERROR] helper.creep.actions - Unknown target type '${targetType}'`)
    }
    if (result == OK) {
        delete creep.memory.targetId;
        delete creep.memory.targetType;
    }
    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
            visualizePathStyle: {stroke: '#ffdd00'}
            // ,
            // costCallback: (roomName, costMatrix) => {
            //     let posList = PositionHelper.getAdjacentPositions(target.pos);
            //     for (let pos in posList) {
            //         costMatrix.set(posList[pos].x, posList[pos].y, 3);
            //     }
            //     return costMatrix
            // }
        });

    }
};

interface TargetDetails {
    id: string,
    type: string
}

/**
 * Commits nearest available target to creep memory and returns target details.
 */
const getNearestTarget = (creep: Creep, origin: RoomPosition): TargetDetails => {
    let container = origin.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy >= creep.carryCapacity
        }
    });
    if (container) {
        creep.memory.targetId = container.id;
        creep.memory.targetType = STRUCTURE_CONTAINER;
        return {
            id: container.id,
            type: STRUCTURE_CONTAINER
        }
    }
    let droppedEnergy = origin.findClosestByPath(FIND_DROPPED_RESOURCES, {
        filter: (resource) => {
            return resource.resourceType == RESOURCE_ENERGY;
        }
    });
    if (droppedEnergy) {
        creep.memory.targetId = droppedEnergy.id;
        creep.memory.targetType = RESOURCE_ENERGY;
        return {
            id: droppedEnergy.id,
            type: RESOURCE_ENERGY
        }
    }
    return null;
};

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