export const mergeSlices = <T extends Record<string, any>>(
    persistedState: Partial<T>,
    currentState: T
): T => {
    const mergedState = { ...currentState };

    Object.keys(mergedState).forEach((key) => {
        mergedState[key as keyof T] = {
            ...currentState[key],
            ...persistedState[key]
        } as T[keyof T];
    });

    return mergedState;
};

export const updateSlice = <T extends Record<string, any>, K extends keyof T>(
    sliceName: K,
    updates: Partial<T[K]> | ((currentSlice: T[K]) => Partial<T[K]>)
) => (state: T) => {
    const computedUpdates = typeof updates === 'function' ? updates(state[sliceName]) : updates;

    return {
        [sliceName]: {
            ...state[sliceName],
            ...computedUpdates
        }
    } as Partial<T>;
};
