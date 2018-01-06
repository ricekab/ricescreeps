export class PositionUtil {
    public static getAdjacentPositions(sourcePos: RoomPosition): RoomPosition[] {
        let result: RoomPosition[] = [];
        for (let xi = -1; xi < 2; xi++) {
            for (let yi = -1; yi < 2; yi++) {
                if (xi === yi && yi === 0) {      // Ignore (0,0) offset
                    continue;
                }
                result.push(new RoomPosition(sourcePos.x + xi, sourcePos.y + yi, sourcePos.roomName));
            }
        }
        return result;
    }
}
