import type WaveSurfer from "wavesurfer.js"

export const pixelToTimeInSeconds = (waveSurfer: WaveSurfer | null, pixelX: number): number => {
    if (!waveSurfer) return 0
    return (waveSurfer.getScroll() + pixelX) / waveSurfer.options.minPxPerSec
}