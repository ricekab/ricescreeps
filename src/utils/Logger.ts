/** Default interval (in minutes) for email batches */
const _DEFAULT_INTERVAL = 360;

export class Logger {
    /** Writes to console only. */
    public static CONSOLE(message: string) {
        console.log(message);
    }

    /** Writes to console and also notifies player via email. */
    public static ERR_NOTIFY(message: string, interval: number = _DEFAULT_INTERVAL) {
        console.log(message);
        Game.notify(message, interval);
    }
}
