export const POSITION_GAP = 1000;

export function calculatePosition(
    prevPosition: number | null | undefined,
    nextPosition: number | null | undefined
): number {
    if (prevPosition === null || prevPosition === undefined) {
        if (nextPosition === null || nextPosition === undefined) {
            return POSITION_GAP;
        }
        return nextPosition - POSITION_GAP;
    }

    if (nextPosition === null || nextPosition === undefined) {
        return prevPosition + POSITION_GAP;
    }

    return (prevPosition + nextPosition) / 2;
}
