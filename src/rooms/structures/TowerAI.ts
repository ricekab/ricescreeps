import {Priority} from "../../constants";
import {WorkerJobType} from "../../empire/RequestType";
import {Requests} from "../../empire/Requests";

export class TowerAI {
    private static REPAIR_THRESHOLD = 6000;

    private static initRequest(tower: StructureTower) {
        return Requests.submitWorkerJobRequest(tower.id, {
            type: WorkerJobType.REPLENISH_ENERGY,
            priority: TowerAI.calculatePriority(tower)
        });
    }

    private static calculatePriority(tower: StructureTower): Priority {
        if (tower.energy < 50) {
            return Priority.HIGH;
        }
        if (tower.energy < 900) {
            return Priority.NORMAL;
        }
        return tower.energy < tower.energyCapacity ? Priority.MINIMAL : Priority.NONE;
    }

    private static _update(tower: StructureTower) {
        const request = Requests.getRequestById(tower.id);
        if (!request) {
            TowerAI.initRequest(tower);
        }
        Requests.updatePriority(tower.id, request, TowerAI.calculatePriority(tower));
    }

    private static _run(tower: StructureTower): ScreepsReturnCode {
        if (tower.energy === 0) {
            return ERR_NOT_ENOUGH_RESOURCES;
        }
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            return tower.attack(closestHostile);
        }
        const criticalStructures = tower.room.find<Structure>(FIND_STRUCTURES, {
            filter: (struct) => struct.hits < TowerAI.REPAIR_THRESHOLD && (struct.hits < struct.hitsMax / 2)
        });
        if (criticalStructures.length > 0) {
            const lowestStructure = _.min(criticalStructures, "hits");
            return tower.repair(lowestStructure);
        }
        return OK;
    }

    public static run(tower: StructureTower) {
        TowerAI._update(tower);
        TowerAI._run(tower);
    }
}
