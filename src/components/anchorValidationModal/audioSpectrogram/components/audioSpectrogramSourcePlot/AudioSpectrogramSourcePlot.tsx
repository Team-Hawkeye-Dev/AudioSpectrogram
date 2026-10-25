import { useAudioSpectrogramUrl } from "../../hooks/useAudioSpectrogramUrl"
import { useAudioSpectrogramViewer } from "../../hooks/useAudioSpectrogramViewer"
import { useZoomSelection } from "../../hooks/useZoomSelection"
import type { AudioSpectrogramSource } from "../../types/audioSpectrogram.types"
import { AudioSpectrogramViewer } from "../../../../../core/components/spectrogram/audioSpectrogramViewer/AudioSpectrogramViewer"

export const AudioSpectrogramSourcePlot = ({
    audioGuid,
    spectrogramType,
    maxHz,
    stepHz
}: AudioSpectrogramSource) => {
    const { audioUrl } = useAudioSpectrogramUrl(audioGuid, spectrogramType)
    const {
        spectrogramContainerRef,
        waveSurferInstanceRef,
        initialViewRef,
        spectrogramPlotType,
        isReadyAudio,
        applyZoomView,
        isPlaying,
        togglePlay,
        playbackPosition,
        detections,
    } = useAudioSpectrogramViewer(audioUrl, maxHz, spectrogramType)

    const zoom = useZoomSelection({
        spectrogramContainerRef,
        waveSurferInstanceRef,
        initialViewRef,
        spectrogramPlotType,
        isReadyAudio,
        applyZoomView,
    })

    if (!audioUrl) return null
    return (
        <AudioSpectrogramViewer
            maxHz={maxHz}
            stepHz={stepHz}
            spectrogramContainerRef={spectrogramContainerRef}
            isReadyAudio={isReadyAudio}
            zoom={zoom}
            playback={{ isPlaying, togglePlay, playbackPosition }}
            detections={detections}
        />
    )
}
