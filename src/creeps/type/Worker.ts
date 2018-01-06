import {CreepType, RiceCreepMemory} from "../../constants";
import {TaskDescriptor} from "../TaskDetails";
import {CreepTask} from "../TaskEnum";
import {CreepTypeHelper} from "./shared";

export class WorkerCreep {
    private static BASE = [MOVE, CARRY, WORK];
    public static MINIMUM_ENERGY_REQUIRED = CreepTypeHelper.GET_PARTS_COST(WorkerCreep.BASE);
    private static PART_ARRAY = [[CARRY, MOVE], [CARRY, MOVE], [WORK]];

    /** Generate memory object for a new creep. Optionally a list of starting tasks can be supplied. */
    public static generateMemory(tasks: Array<TaskDescriptor<any>> = []): RiceCreepMemory {
        return {type: CreepType.WORKER, state: CreepTask.SPAWN, taskStack: tasks};
    }

    /** Generate an (ordered) list of body parts to spawn */
    public static generateParts = (energyLimit: number): BodyPartConstant[] => {
        let parts = CreepTypeHelper.GENERATE_PARTS(energyLimit, WorkerCreep.BASE,
            WorkerCreep.PART_ARRAY, true);
        return WorkerCreep.formatParts(parts);
    };

    /** Reorders parts */
    private static formatParts = (parts: BodyPartConstant[]) => {
        return parts;
    };
}
