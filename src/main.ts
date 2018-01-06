import {CLEAN_MEMORY_PERIOD, VERSIONS} from "./constants";
import {CreepManager} from "./creeps/CreepManager";
import {Empire} from "./empire/Empire";
import {FlagManager} from "./flags/FlagManager";
import {RoomManager} from "./rooms/RoomManager";
import {ErrorMapper} from "./utils/ErrorMapper";
import {Logger} from "./utils/Logger";

// Initialization IIFE
(() => {
    if (!Memory.versions) {
        Memory.versions = {};
    }
    if (Memory.versions.room !== VERSIONS.ROOM_MEM) { // Memory structure updated or doesn't exist.
        const myRooms = _.filter(Game.rooms, (room) => room.controller ? room.controller.my : false);
        _.forEach(myRooms, (room) => RoomManager.initState(room));
    }
    if (Memory.versions.empire !== VERSIONS.EMPIRE_MEM) { // Memory structure outdated or doesn't exist.
        Empire.initState();
    }
    if (Memory.versions.flag !== VERSIONS.FLAG_MEM) {
        _.forEach(Game.flags, (flag) => FlagManager.initState(flag));
    }
    Memory.versions = {
        room: VERSIONS.ROOM_MEM,
        empire: VERSIONS.EMPIRE_MEM,
        flag: VERSIONS.FLAG_MEM
    };
})();

const cleanMemory = () => {
    if (Game.time % CLEAN_MEMORY_PERIOD === 0) {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                Logger.CONSOLE(`Clearing non-existing creep memory: ${name}`);
                delete Memory.creeps[name];
            }
        }
        for (const name in Memory.flags) {
            if (!Game.flags[name]) {
                Logger.CONSOLE(`Clearing non-existing flag memory: ${name}`);
                delete Memory.flags[name];
            }
        }
    }
};

export const loop = ErrorMapper.wrapLoop(() => {
    // Clean various memory segments
    cleanMemory();

    const myRooms = _.filter(Game.rooms, (room) => room.controller ? room.controller.my : false);

    // ROOM UPDATE
    _.forEach(myRooms, (room) => RoomManager.updateState(room));

    _.forEach(Game.creeps, (creep) => {
        CreepManager.update(creep);
        CreepManager.run(creep);
    });

    _.forEach(Game.flags, (flag) => {
        FlagManager.update(flag);
        FlagManager.run(flag);
    });

    Empire.update();
    Empire.run();

    // ROOM RUN (STRUCTURES)
    _.forEach(myRooms, (room) => RoomManager.run(room));

});
