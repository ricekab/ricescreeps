/**
 * Spanws a Miner creep, using 250 energy.
 */
export const spawnSmall = (spawner: StructureSpawn, name: string, sourceId: string) => {
    spawner.spawnCreep([MOVE, WORK, WORK], name, {memory: {role: 'miner', sourceId: sourceId}});
};

export const run = (creep: Creep) => {
    let source: Source = Game.getObjectById(creep.memory.sourceId);
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#a00000'}});
    }
};