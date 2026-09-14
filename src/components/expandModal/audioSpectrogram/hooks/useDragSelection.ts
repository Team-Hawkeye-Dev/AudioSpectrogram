import { useState, useRef, type PointerEvent } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import { CONTAINER_CENTER_RATIO, DRAG_ZOOM_OUT_FACTOR, VISIBLE_WINDOW_SECONDS } from '../consts/audioSpectrogram.consts';
import type { SpectrogramInteractionContext } from '../types/audioSpectrogram.types';

interface Selection {
    startPx: number
    currentPx: number
}

// WaveSurfer has no built-in pixel-to-time conversion. viewportPixelX is relative
// to the visible (scrolled) viewport, so add the scroll offset to place it on the
// full waveform, then divide by the zoom scale (pixels per second) to get seconds.
const pixelToTimeInSeconds = (waveSurfer: WaveSurfer, viewportPixelX: number): number => {
    const absolutePixelX = waveSurfer.getScroll() + viewportPixelX
    return absolutePixelX / waveSurfer.options.minPxPerSec
}

interface UseDragSelectionProps extends SpectrogramInteractionContext {
    onZoomIn: (minPxPerSec: number, scrollTime: number) => void
    onZoomOut: (minPxPerSec: number, scrollTime: number) => void
}

const LEFT_MOUSE_CLICK = 0

export const useDragSelection = ({
spectrogramContainerRef, waveSurferInstanceRef, audioDuration,  isReadyAudio, onZoomIn, onZoomOut
}: UseDragSelectionProps) => {
    const [selection, setSelection] = useState<Selection | null>(null)
    const startPxRef = useRef<number | null>(null)

    const getRect = (target: HTMLElement) => target.getBoundingClientRect()

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
        const minZoom = width / VISIBLE_WINDOW_SECONDS
        const nextMinPxPerSec = Math.max(minZoom, waveSurfer.options.minPxPerSec / DRAG_ZOOM_OUT_FACTOR)
        const visibleDuration = width / nextMinPxPerSec
        const centerTime = pixelToTimeInSeconds(waveSurfer, width * CONTAINER_CENTER_RATIO)
        const maxScroll = Math.max(0, audioDuration - visibleDuration)
        const nextScroll = Math.min(maxScroll, Math.max(0, centerTime - visibleDuration * CONTAINER_CENTER_RATIO))
        onZoomOut(nextMinPxPerSec, nextScroll)
    }

    const zoomInToRightDragSelection = (waveSurfer: WaveSurfer, width: number, startPx: number, endPx: number) => {
        const startTime = pixelToTimeInSeconds(waveSurfer, Math.min(startPx, endPx))
        const endTime = pixelToTimeInSeconds(waveSurfer, Math.max(startPx, endPx))
        const selectedDuration = endTime - startTime
        if (selectedDuration > 0) {
            onZoomIn(width / selectedDuration, startTime)
        }
    }

    const onDragEnd = (event: PointerEvent<HTMLDivElement>) => {
       const waveSurfer = waveSurferInstanceRef.current
    const startPx = startPxRef.current
       startPxRef.current = null
       setSelection(null)

       if (!waveSurfer || startPx === null) return

       const endPx = event.clientX - getRect(event.currentTarget).left
       const dragPx = endPx - startPx
       const width = spectrogramContainerRef.current?.clientWidth ?? 0

       if (dragPx < 0) {
        zoomOutFromLeftDrag(waveSurfer, width)
        return
       }
       zoomInToRightDragSelection(waveSurfer, width, startPx, endPx)
    }

    return { selection, onDragStart, onDragMove, onDragEnd }
}
