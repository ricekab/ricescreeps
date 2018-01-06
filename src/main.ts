import * as _ from "lodash";
import * as Builder from "./creeps/role.builder";
import * as Harvester from "./creeps/role.harvester";
import * as Miner from "./creeps/role.miner";
import * as Repairer from "./creeps/role.repairer";
import * as Upgrader from "./creeps/role.upgrader";
import * as RoomManager from "./room.main";
import {ErrorMapper} from "./utils/ErrorMapper";

const getNextOpenSource = (miners: Creep[]): Source  => {
    const sources = Game.spawns.Spawn1.room.find(FIND_SOURCES);
    for (const source in sources) {
        const sourceMiners = _.filter(miners, (miner) => {
            return (miner.memory.sourceId === sources[source].id);
        });
        const nodeCapacity = 3; // TODO: Actual node capacity.
        if (sourceMiners.length < nodeCapacity) {
            return sources[source];
        }
    }
    console.log("[ERROR] main - getNextOpenSource did not return a source!");
    return null;
};

export const loop = ErrorMapper.wrapLoop(() => {
    // CLEAN MEMORY
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            // TODO: Adjust memory for rooms, etc if needed.
            delete Memory.creeps[name];
            console.log("Clearing non-existing creep memory:", name);
        }
    }

    const energy: number = 0;

    // STATE REFRESH
    for (const name in Game.rooms) {
        RoomManager.manage(Game.rooms[name]);
        const room = Game.rooms[name];
    }

    // SPAWN / RESPAWN CREEPS
    const maxHarvesters = 6;
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === "harvester");
    if (harvesters.length < maxHarvesters) {
        const newName = "Harvester" + Game.time;
        const priority = harvesters.length;
        Harvester.spawnHarvester(Game.spawns.Spawn1, energy, newName, priority);
    }

    /*
      TODO: Look at memory for amount of open positions in the room. If it is not set run a calculation and set it in
      the memory.
     */
    const maxMiners = 6;
    const miners: Creep[] = _.filter(Game.creeps, (creep) => creep.memory.role === "miner");

    if (miners.length < maxMiners) {
        const nextMinerSource: Source = getNextOpenSource(miners);
        const newName = "Miner" + Game.time;
        Miner.spawnSmall(Game.spawns.Spawn1, newName, nextMinerSource.id);
    }

    const maxUpgraders = 6;
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === "upgrader");
    if (upgraders.length < maxUpgraders) {
        const newName = "Upgrader" + Game.time;
        Upgrader.spawnSmall(Game.spawns.Spawn1, newName);
    }

    const maxBuilders = 5;
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === "builder");

    if (builders.length < maxBuilders) {
        const newName = "Builder" + Game.time;
        Builder.spawnSmall(Game.spawns.Spawn1, newName);
    }

    const maxRepairers = 3;
    const repairers = _.filter(Game.creeps, (creep) => creep.memory.role === "repairer");

    if (repairers.length < maxRepairers) {
        const newName = "Repairer" + Game.time;
        Repairer.spawnRepairer(Game.spawns.Spawn1, energy, newName, repairers.length);
    }
    // CREEP AI
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === "harvester") {
            Harvester.run(creep);
        }
        if (creep.memory.role === "upgrader") {
            Upgrader.run(creep);
        }
        if (creep.memory.role === "builder") {
            Builder.run(creep);
        }
        if (creep.memory.role === "miner") {
            Miner.run(creep);
        }
        if (creep.memory.role === "repairer") {
            Repairer.run(creep);
        }
    }
});
