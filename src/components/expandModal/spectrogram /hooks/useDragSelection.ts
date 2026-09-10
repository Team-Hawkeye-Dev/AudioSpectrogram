import { useRef, useState, type PointerEvent, type RefObject } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import { VISIBLE_WINDOW_SECONDS } from '../consts/spectrogram.consts';
import { pixelToTimeInSeconds } from '../utils/pixelToTime';

interface Selection {
    startPx: number;
    currentPx: number;
}

interface UseDragSelectionProps {
    containerRef: RefObject<HTMLDivElement | null> 
    waveSurferRef: RefObject<WaveSurfer | null> 
    audioDuration: number
    isReadyAudio: boolean
    onZoomIn: (minPxPerSec: number, scrollTime: number) => void
    onZoomOut: (minPxPerSec: number, scrollTime: number) => void
}

const LEFT_MOUSE_CLICK = 0

export const useDragSelection = ({
containerRef, waveSurferRef, audioDuration,  isReadyAudio, onZoomIn, onZoomOut
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

    const onDragEnd = (event: PointerEvent<HTMLDivElement>) => {
       const waveSurfer = waveSurferRef.current
       const startPx = startPxRef.current
       startPxRef.current = null
       setSelection(null)

       if (!waveSurfer || startPx === null) return

       const endPx = event.clientX - getRect(event.currentTarget).left
       const dragPx = endPx - startPx
       const width = containerRef.current?.clientWidth ?? 0

       if (dragPx < 0) {
        const minZoom = width / VISIBLE_WINDOW_SECONDS
        const nextMinPxPerSec = Math.max(minZoom, waveSurfer.options.minPxPerSec / 2)
        const visibleDuration = width / nextMinPxPerSec
        const centerTime = pixelToTimeInSeconds(waveSurfer, width / 2)
        const maxScroll = Math.max(0, audioDuration - visibleDuration)
        const nextScroll = Math.min(maxScroll, Math.max(0, centerTime - visibleDuration / 2))
        onZoomOut(nextMinPxPerSec, nextScroll)
       } else {
        //Drag right -> zoom in to selection
        const startTime = pixelToTimeInSeconds(waveSurfer, Math.min(startPx, endPx))
        const endTime = pixelToTimeInSeconds(waveSurfer, Math.max(startPx, endPx))
        const selectedDuration = endTime - startTime
        if (selectedDuration > 0) {
            onZoomIn(width / selectedDuration, startTime)
        }
       }
    }

    return { selection, onDragStart, onDragMove, onDragEnd }
}
