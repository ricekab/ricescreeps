interface CreepMemory {
    type: string;
    state: any;
    task?: any;
    taskStack: any[];

    [name: string]: any;
}

interface FlagMemory {
    type: string;

    [name: string]: any;
}

interface SpawnMemory {
    [name: string]: any;
}

interface RoomMemory {
    energyHistory: number[];

    [name: string]: any;
}
