import type { DragSelection } from "../types";

export const isFrequencySelection = (selection: DragSelection) =>
    Math.abs(selection.currentYPx - selection.startYPx) > Math.abs(selection.currentPx - selection.startPx);

export const getZoomSelection = (selection: DragSelection) => {
    if (isFrequencySelection(selection)) {
        return {
            left: 0,
            right: 0,
            top: Math.min(selection.startYPx, selection.currentYPx),
            height: Math.abs(selection.currentYPx - selection.startYPx)
        };
    }

    return {
        top: 0,
        bottom: 0,
        left: Math.min(selection.startPx, selection.currentPx),
        width: Math.abs(selection.currentPx - selection.startPx)
    };
};
