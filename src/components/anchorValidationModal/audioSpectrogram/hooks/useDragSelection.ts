import { useCallback, useState, useRef, type PointerEvent } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import { useSnackbar } from 'notistack';
import { CLICK_MAX_DRAG_PX, CONTAINER_CENTER_RATIO, DRAG_ZOOM_OUT_FACTOR, MAX_ZOOM_CANVAS_PX, MAX_ZOOM_VISIBLE_SECONDS, MIN_ZOOM_SELECTION_PX } from '../consts/audioSpectrogram.consts';
import type { SpectrogramInteractionContext } from '../types/audioSpectrogram.types';
import { useMassiviAppStore } from '../../../../store/useStore';

interface Selection {
    startPx: number
    currentPx: number
}

interface UseDragSelectionProps extends SpectrogramInteractionContext {
    minZoomPxPerSec: number;
    onZoomIn: (minPxPerSec: number, scrollTime: number) => void
    onZoomOut: (minPxPerSec: number, scrollTime: number) => void
}

const LEFT_MOUSE_CLICK = 0

export const useDragSelection = ({
spectrogramPlotType, spectrogramContainerRef, waveSurferInstanceRef, isReadyAudio, minZoomPxPerSec, onZoomIn, onZoomOut
}: UseDragSelectionProps) => {
    const audioDuration = useMassiviAppStore((state) => state.anchorValidationSection.spectrogramAudioDuration[spectrogramPlotType])
    const setSpectrogramWindow = useMassiviAppStore((state) => state.anchorValidationSection.setSpectrogramWindow)
    const { enqueueSnackbar } = useSnackbar();

    const [selection, setSelection] = useState<Selection | null>(null)
    const startPxRef = useRef<number | null>(null)

    const getRect = (target: HTMLElement) => target.getBoundingClientRect()

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
        startPxRef.current = startPx
        setSelection({startPx, currentPx: startPx})
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const onDragMove = (event: PointerEvent<HTMLDivElement>) => {
        if (!selection) return
        const currentPx = event.clientX - getRect(event.currentTarget).left
        setSelection((prev) => prev ? {...prev, currentPx} : null)
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
            enqueueSnackbar('Maximum zoom level reached', {
                variant: 'info',
                preventDuplicate: true
            })
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

    const onDragEnd = (event: PointerEvent<HTMLDivElement>) => {
        const spectrogramContainer = spectrogramContainerRef.current
        if (!spectrogramContainer) return 

       const waveSurfer = waveSurferInstanceRef.current
       const startPx = startPxRef.current
       startPxRef.current = null
       setSelection(null)

       if (!waveSurfer || startPx === null) return

       const endPx = event.clientX - getRect(event.currentTarget).left
       const dragPx = endPx - startPx
       const width = spectrogramContainer.clientWidth;

       const isClick = Math.abs(dragPx) <= CLICK_MAX_DRAG_PX
       if (isClick) {
        waveSurfer.setTime(Math.min(audioDuration, pixelToTimeInSeconds(waveSurfer, endPx)))
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
