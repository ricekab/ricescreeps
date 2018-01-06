import {Priority} from "../../constants";
import {WorkerJobType} from "../../empire/RequestType";
import {Requests} from "../../empire/Requests";

export class RControllerAI {
    private static CRITICAL_DOWNGRADE_THRESHOLD = 2500;
    private static DOWNGRADE_OFFSET = 10000;

    private static initRequest(controller: StructureController) {
        return Requests.submitWorkerJobRequest(controller.id, {
            type: WorkerJobType.UPGRADE,
            priority: RControllerAI.calculatePriority(controller)
        });
    }

    private static calculatePriority(controller: StructureController): Priority {
        const remaining = controller.ticksToDowngrade;
        if (remaining < this.CRITICAL_DOWNGRADE_THRESHOLD) {
            return Priority.CRITICAL;
        }
        if (controller.level < 3) {
            return Priority.NORMAL;
        }
        if (remaining < CONTROLLER_DOWNGRADE[controller.level] - RControllerAI.DOWNGRADE_OFFSET) {
            return Priority.NORMAL;
        }
        if (controller.level < 8) {
            return Priority.LOW;
        }
        return Priority.MINIMAL;
    }

    public static run(controller: StructureController) {
        const request = Requests.getRequestById(controller.id);
        if (!request) {
            RControllerAI.initRequest(controller);
        }
        Requests.updatePriority(controller.id, request, RControllerAI.calculatePriority(controller));
    }
}
