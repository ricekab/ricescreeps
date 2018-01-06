import {CreepTask} from "./TaskEnum";

export interface TaskDescriptor<T> {
    state: CreepTask;
    task: T;
}

export interface PositionDetails {
    roomName: string;
    x: number;
    y: number;
}

export interface MoveToDetails extends PositionDetails {
    range: number;
}

export interface TargetIdDetails {
    targetId: string;
}

export interface ResourceDetails {
    resourceType: ResourceConstant;
    amount?: number;
}

export interface TargetResourceDetails extends TargetIdDetails, ResourceDetails {
}
