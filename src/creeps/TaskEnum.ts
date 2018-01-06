export const enum CreepTask {
    SPAWN,       // Being spawned
    IDLE,         // Nothing to do
    // IDLING_ENDOFLIFE,   // Shouldn't do complex things?
    MOVE_TO,
    MOVE_ON,
    BUILD,
    REPAIR,
    HARVEST,
    MINE, // Indefinite Harvest
    WITHDRAW,
    TRANSFER,
    UPGRADE,
    PICK_UP,
    DROP // ,
    // SUPERSEDED      // Manual order mode, must be manually reset to idle (eg. Taking over during attacks)
}
