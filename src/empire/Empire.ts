import * as Constants from "../constants";
import {PriorityQueueUtil} from "../utils/PriorityQueueUtil";

export class Empire {
    public static initState() {
        const creepMap = {};
        _.forEach(Memory.creeps, (creepMemory) => {
            let type = creepMemory.type;
            creepMap[type] ? creepMap[type]++ : creepMap[type] = 1;
        });
        Memory.empire = {
            energyHistory: [],
            requests: {},
            workerJobQueue: PriorityQueueUtil.createQueue(),
            spawnQueue: PriorityQueueUtil.createQueue(),
            creepList: creepMap
        };
    }

    public static update() {
        if (Game.time % Constants.EMPIRE_UPDATE_PERIOD === 0) {
            const currentEnergyTotal = Empire.getEnergyTotal();
            let energyHistory = Memory.empire.energyHistory;
            energyHistory.push(currentEnergyTotal);
            if (energyHistory.length > Constants.EMPIRE_UPDATE_HISTORY_SIZE) {
                energyHistory.shift();
            }
        }
    }

    public static run() {
        // TODO: Military delegation here?
        // TODO: Submit spawn and job requests based on state.
    }

    private static getEnergyTotal() {
        return _
            .map(Memory.rooms, (roomMem) => roomMem.energyHistory ? _.last(roomMem.energyHistory) : 0)
            .reduce((total, energy) => total + energy);
    }
}
