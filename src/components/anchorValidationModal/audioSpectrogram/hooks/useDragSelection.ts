import { useCallback, useState, useRef, type PointerEvent } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import { useSnackbar } from 'notistack';
import { CLICK_MAX_DRAG_PX, CONTAINER_CENTER_RATIO, DRAG_ZOOM_OUT_FACTOR, MAX_ZOOM_CANVAS_PX, MAX_ZOOM_VISIBLE_SECONDS, MIN_ZOOM_SELECTION_PX, TIME_AXIS_HEIGHT_PX } from '../consts/audioSpectrogram.consts';
import type { SpectrogramInteractionContext } from '../types/audioSpectrogram.types';
import type { DragSelection } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';
import { isFrequencySelection } from '../../../../core/components/spectrogram/audioSpectrogramViewer/utils/selectionHighlight';
import { useMassiviAppStore } from '../../../../store/useStore';

interface UseDragSelectionProps extends SpectrogramInteractionContext {
    minZoomPxPerSec: number;
    onZoomIn: (minPxPerSec: number, scrollTime: number) => void
    onZoomOut: (minPxPerSec: number, scrollTime: number) => void
    onYAxisZoomIn: (selectionTopRatio: number, selectionBottomRatio: number) => void
    onYAxisZoomOut: () => void
    isMaxYAxisZoom: boolean
}

const LEFT_MOUSE_CLICK = 0

export const useDragSelection = ({
spectrogramPlotType, spectrogramContainerRef, waveSurferInstanceRef, isReadyAudio, minZoomPxPerSec, onZoomIn, onZoomOut, onYAxisZoomIn, onYAxisZoomOut, isMaxYAxisZoom
}: UseDragSelectionProps) => {
    const audioDuration = useMassiviAppStore((state) => state.anchorValidationSection.spectrogramAudioDuration[spectrogramPlotType])
    const setSpectrogramWindow = useMassiviAppStore((state) => state.anchorValidationSection.setSpectrogramWindow)
    const { enqueueSnackbar } = useSnackbar();
    const showMaxZoomReached = () => enqueueSnackbar('Maximum zoom level reached', { variant: 'info', preventDuplicate: true })

    const [selection, setSelection] = useState<DragSelection | null>(null)
    const startPxRef = useRef<number | null>(null)

    const getRect = (target: HTMLElement) => target.getBoundingClientRect()

    const getSpectrogramHeightPx = (target: HTMLElement) => target.clientHeight - TIME_AXIS_HEIGHT_PX

    const getPointerYPx = (event: PointerEvent<HTMLDivElement>) => {
        const spectrogramHeightPx = getSpectrogramHeightPx(event.currentTarget)
        const pointerYPx = event.clientY - getRect(event.currentTarget).top
        return Math.min(Math.max(pointerYPx, 0), spectrogramHeightPx)
    }

    const pixelToTimeInSeconds = useCallback((waveSurfer: WaveSurfer, viewportPixelX: number): number => {
        const absolutePixelX = waveSurfer.getScroll() + viewportPixelX
        return absolutePixelX / waveSurfer.options.minPxPerSec
    }, [])

    const resolveZoomInMinPxPerSec = useCallback((
        width: number,
        selectedDuration: number,
        audioDuration: number
    ): number => {
        const requestedMinPxPerSec = width / selectedDuration;
        const maxZoomByVisibleTime = width / MAX_ZOOM_VISIBLE_SECONDS;
        const maxZoomByCanvasBudget = MAX_ZOOM_CANVAS_PX / (audioDuration * (window.devicePixelRatio || 1))
        const maxMinPxPerSec = Math.min(maxZoomByVisibleTime, maxZoomByCanvasBudget)
        return Math.min(requestedMinPxPerSec, maxMinPxPerSec)
    }, [])

    const onDragStart = (event: PointerEvent<HTMLDivElement>) => {
        if (!isReadyAudio || event.button !== LEFT_MOUSE_CLICK) return
        const startPx = event.clientX - getRect(event.currentTarget).left
        const startYPx = getPointerYPx(event)
        startPxRef.current = startPx
        setSelection({startPx, currentPx: startPx, startYPx, currentYPx: startYPx})
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const onDragMove = (event: PointerEvent<HTMLDivElement>) => {
        if (!selection) return
        const currentPx = event.clientX - getRect(event.currentTarget).left
        const currentYPx = getPointerYPx(event)
        setSelection((prev) => prev ? {...prev, currentPx, currentYPx} : null)
    }

    const zoomOutFromLeftDrag = (waveSurfer: WaveSurfer, width: number) => {
        const zoomedOutPxPerSec = waveSurfer.options.minPxPerSec / DRAG_ZOOM_OUT_FACTOR
        const nextMinPxPerSec = Math.max(minZoomPxPerSec, zoomedOutPxPerSec)

        const visibleDuration = width / nextMinPxPerSec
        const containerCenterPx = width * CONTAINER_CENTER_RATIO
        const centerTime = pixelToTimeInSeconds(waveSurfer, containerCenterPx)
        
        const maxScroll = Math.max(0, audioDuration - visibleDuration)
        const centeredScrollTime = centerTime - visibleDuration * CONTAINER_CENTER_RATIO
        const nextScroll = Math.min(maxScroll, Math.max(0, centeredScrollTime))
        
        setSpectrogramWindow(spectrogramPlotType, {
            currentStartTime: nextScroll,
            currentEndTime:  nextScroll + visibleDuration
        })
        onZoomOut(nextMinPxPerSec, nextScroll)
    }

    const zoomInToRightDragSelection = (waveSurfer: WaveSurfer, width: number, startPx: number, endPx: number) => {
        const startTime = pixelToTimeInSeconds(waveSurfer, Math.min(startPx, endPx))
        const endTime = pixelToTimeInSeconds(waveSurfer, Math.max(startPx, endPx))
        const selectedDuration = endTime - startTime
        if (selectedDuration <= 0 || audioDuration <= 0) return

        const nextMinPxPerSec = resolveZoomInMinPxPerSec(width, selectedDuration, audioDuration)

        if (nextMinPxPerSec <= waveSurfer.options.minPxPerSec) {
            showMaxZoomReached()
            return
        }

        const visibleDuration = width / nextMinPxPerSec
        const visibleEndTime = Math.min(audioDuration, startTime + visibleDuration)
        setSpectrogramWindow(spectrogramPlotType, {
            currentStartTime: startTime, 
            currentEndTime: visibleEndTime
        })
        onZoomIn(nextMinPxPerSec, startTime)
    }

    const zoomYAxisFromVerticalDrag = (spectrogramContainer: HTMLDivElement, startYPx: number, endYPx: number) => {
        const isUpwardDrag = endYPx < startYPx
        if (isUpwardDrag) {
            onYAxisZoomOut()
            return
        }
        if (isMaxYAxisZoom) {
            showMaxZoomReached()
            return
        }
        const spectrogramHeightPx = getSpectrogramHeightPx(spectrogramContainer)
        const selectionTopRatio = startYPx / spectrogramHeightPx
        const selectionBottomRatio = endYPx / spectrogramHeightPx
        onYAxisZoomIn(selectionTopRatio, selectionBottomRatio)
    }

    const onDragEnd = (event: PointerEvent<HTMLDivElement>) => {
        const spectrogramContainer = spectrogramContainerRef.current
        if (!spectrogramContainer) return 

       const waveSurfer = waveSurferInstanceRef.current
       const startPx = startPxRef.current
       startPxRef.current = null
       setSelection(null)

       if (!waveSurfer || startPx === null || !selection) return

       const endPx = event.clientX - getRect(event.currentTarget).left
       const endYPx = getPointerYPx(event)
       const dragPx = endPx - startPx
       const dragYPx = endYPx - selection.startYPx
       const width = spectrogramContainer.clientWidth;

       const isClick = Math.abs(dragPx) <= CLICK_MAX_DRAG_PX && Math.abs(dragYPx) <= CLICK_MAX_DRAG_PX
       if (isClick) {
        const clickedTime = pixelToTimeInSeconds(waveSurfer, endPx)
        const seekTime = Math.min(audioDuration, clickedTime)
        waveSurfer.setTime(seekTime)
        return
       }
       const finalSelection = { ...selection, currentPx: endPx, currentYPx: endYPx }
       if (isFrequencySelection(finalSelection)) {
        zoomYAxisFromVerticalDrag(spectrogramContainer, selection.startYPx, endYPx)
        return
       }
       if (dragPx < 0) {
        zoomOutFromLeftDrag(waveSurfer, width)
        return
       }
       if (dragPx < MIN_ZOOM_SELECTION_PX) {
        if (dragPx > 0) {
            enqueueSnackbar(
                'Selected area is too small to zoom. Please select a wider area.', {
                    variant: 'warning'
                }
            )
        }
        return
       }
       zoomInToRightDragSelection(waveSurfer, width, startPx, endPx)
    }

    return { selection, onDragStart, onDragMove, onDragEnd }
}
