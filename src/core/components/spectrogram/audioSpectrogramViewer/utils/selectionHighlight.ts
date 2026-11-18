import type { DragSelection } from "../types";

export const getZoomSelection = (selection: DragSelection) => ({
    startSelection: Math.min(selection.startPx, selection.currentPx),
    selectionWidth: Math.abs(selection.currentPx - selection.startPx)
});
