import * as RoomSpawn from './room.spawner';

export const manage = (room: Room) => {
    const memory: RoomMemory = room.memory;

    let energyAvailable = room.energyAvailable;
    let energyCapacity = room.energyCapacityAvailable;

    if (energyAvailable % 10 == 0 && energyAvailable > energyCapacity / 2) {
        console.log(`Room ${room.name} has ${room.energyAvailable}/${room.energyCapacityAvailable}`)
    }

    RoomSpawn.spawnForRoom(room);

    // TOWERS
    let towers = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_TOWER;
        }
    });
    let tower: StructureTower;
    for (let name in towers) {
        tower = <StructureTower>towers[name];
        let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax / 2
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

};