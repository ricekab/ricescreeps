const SPAWN_MEMORY_VERSION: number = 1;

const buildMemoryForRoom = (room: Room) => {
    let sources = room.find(FIND_SOURCES);
    room.find(FIND_MINERALS);
};

export const spawnForRoom = (room: Room) => {
    let memory = room.memory.spawner;

    if (!memory || memory.version < SPAWN_MEMORY_VERSION) {       // Spawn memory does not exist yet or is out of date.
        buildMemoryForRoom(room);
    }

    // TODO: Check if a spawn is required / possible.

    let spawners = room.find<StructureSpawn>(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_SPAWN;
        }
    });

    for (let spawnerName in spawners) {
        let spawner: StructureSpawn = spawners[spawnerName];

        // TODO: SPAWN LOGIC HERE
    }
};