import * as Constants from "../constants";
import {PositionUtil} from "../utils/PositionUtil";
import {TowerAI} from "./structures/TowerAI";
import {RControllerAI} from "./structures/RControllerAI";

export class RoomManager {

    private static initNode(room: Room, roomFlags: Flag[], node, resourceType: ResourceConstant,
                            postfix: string | number = "") {
        const resourceName: string = resourceType;
        const colour: ColorConstant = resourceType === RESOURCE_ENERGY ? COLOR_YELLOW : COLOR_CYAN;
        const middlePos = room.getPositionAt(25, 25);
        const flagName = room.name + "#" + resourceName + postfix;
        let flag = _.find(roomFlags, (_flag) => _flag.name === flagName);
        if (!flag) {
            let positions = PositionUtil.getAdjacentPositions(node.pos);
            positions = _.sortByAll(positions,
                (_pos) => Game.map.getTerrainAt(_pos.x, _pos.y, room.name),
                (_dist) => _dist.findPathTo(middlePos).length);
            const pos = positions[0];
            room.createFlag(pos, flagName, colour);
            flag = Game.flags[flagName];
        }
        Memory.flags[flagName] = {
            type: Constants.FlagType.MINE,
            resource: resourceName,
            room: room.name
        };
    }

    /** Should only be run once */
    public static initState(room: Room) {
        // Sources & Minerals
        const roomFlags: Flag[] = _.filter(Game.flags, (_flag) => _flag.name.startsWith(room.name));
        const roomSources = room.find(FIND_SOURCES);
        roomSources.forEach((node, idx) => RoomManager.initNode(room, roomFlags, node, RESOURCE_ENERGY, idx));
        const roomMinerals = room.find(FIND_MINERALS);
        roomMinerals.forEach((node) => RoomManager.initNode(room, roomFlags, node, node.mineralType));
        const currentEnergy = this.getEnergyTotal(room);
        const history = [];
        history.push(currentEnergy);
        room.memory = {
            energyHistory: []
        };
    }

    /** Sums energy available in containers, storage, spawns and extensions */
    private static getEnergyTotal(room: Room) {
        const containers = room.find<StructureContainer>(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER ||
                structure.structureType === STRUCTURE_STORAGE
        });
        let energyTotal = 0;
        energyTotal += containers
            .map((container) => container.store.energy)
            .reduce((total, energy) => total + energy);
        energyTotal += room.energyAvailable;
        return energyTotal;
    }

    public static updateState(room: Room) {
        if (Game.time % Constants.ROOM_UPDATE_PERIOD === 0) {
            const currentEnergyTotal = RoomManager.getEnergyTotal(room);
            let energyHistory = room.memory.energyHistory;
            energyHistory.push(currentEnergyTotal);
            if (energyHistory.length > Constants.ROOM_UPDATE_HISTORY_SIZE) {
                energyHistory.shift(); // Queue pop
            }
        }
    }

    public static run(room: Room) {
        const spawners = room.find<StructureSpawn>(FIND_MY_STRUCTURES, {
            filter: (struct) => struct.structureType === STRUCTURE_SPAWN
        });
        // TODO: SPAWNER STUFF HERE

        if (room.controller && room.controller.my) { // TODO: This does not include remote rooms (reserved rooms)
            RControllerAI.run(room.controller);
        }

        const towers = room.find<StructureTower>(FIND_MY_STRUCTURES, {
            filter: (struct) => struct.structureType === STRUCTURE_TOWER
        });
        _.forEach(towers, (tower) => TowerAI.run(tower));

        const extensions = room.find<StructureSpawn | StructureExtension>(FIND_MY_STRUCTURES, {
            filter: (struct) => struct.structureType === STRUCTURE_EXTENSION || struct.structureType === STRUCTURE_SPAWN
        });
        // TODO: Update <room>_repl request

        const defenses = room.find<StructureRampart | StructureWall>(FIND_STRUCTURES, {
            filter: (struct) => struct.structureType === STRUCTURE_WALL || struct.structureType === STRUCTURE_RAMPART
        });
        // TODO: Update <room>_rep_def request

        const upkeep = room.find<StructureRoad | StructureContainer>(FIND_STRUCTURES, {
            filter: (struct) => struct.structureType === STRUCTURE_ROAD || struct.structureType === STRUCTURE_CONTAINER
        });
        // TODO: Update <room>_rep_infra request
    }
}
