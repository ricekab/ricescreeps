import {FlagType} from "../constants";

export class FlagManager {

    public static initState(flag: Flag) {
        return;
    }

    public static update(flag: Flag) {
        switch (flag.memory.type) {
            case FlagType.MINE:
                break;
        }
    }

    public static run(flag: Flag) {
        switch (flag.memory.type) {
            case FlagType.MINE:
                break;
        }
    }
}
