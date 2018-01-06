export class CreepTypeHelper {
    public static GET_PARTS_COST = (parts: BodyPartConstant[]): number => {
        return parts
            .map((part) => BODYPART_COST[part])
            .reduce((total, current) => total + current);
    };

    /** Generate an (ordered) list of body parts to spawn */
    public static GENERATE_PARTS = (energyLimit: number, base: BodyPartConstant[],
                                    partArray: BodyPartConstant[][], repeat: boolean = true,
                                    maxSize: number = MAX_CREEP_SIZE): BodyPartConstant[] => {
        const minimumCost = CreepTypeHelper.GET_PARTS_COST(base);
        if (energyLimit < minimumCost) {
            return null;
        }
        let parts: BodyPartConstant[] = base.slice();
        let energyCost = minimumCost;
        let index = 0;
        let nextParts = partArray[index];
        let nextCost = CreepTypeHelper.GET_PARTS_COST(nextParts);
        while ((energyCost + nextCost) < energyLimit && (parts.length + nextParts.length) < maxSize) {
            parts = parts.concat(partArray[index++]);
            energyCost += nextCost;
            if (index >= partArray.length) {
                if (repeat) {
                    index %= partArray.length;
                } else {
                    return parts;
                }
            }
            nextParts = partArray[index];
            nextCost = CreepTypeHelper.GET_PARTS_COST(nextParts);
        }
        return parts;
    };
}
