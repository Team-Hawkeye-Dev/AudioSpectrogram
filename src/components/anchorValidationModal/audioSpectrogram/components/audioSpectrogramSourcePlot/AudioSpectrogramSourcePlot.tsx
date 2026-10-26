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
    const { audioUrl, pickingLabelData } = useAudioSpectrogramUrl(audioGuid, spectrogramType)
    const viewer = useAudioSpectrogramViewer(audioUrl, maxHz, spectrogramType, pickingLabelData)
    const zoom = useZoomSelection(viewer)
    const { spectrogramContainerRef, isPlaying, detections, isReadyAudio, togglePlay, playbackPosition} = viewer 

    return (
        <>
            {audioUrl && (<AudioSpectrogramViewer
            maxHz={maxHz}
            stepHz={stepHz}
            spectrogramContainerRef={spectrogramContainerRef}
            isReadyAudio={isReadyAudio}
            zoom={zoom}
            playback={{ isPlaying, togglePlay, playbackPosition }}
            detections={detections}
        />)}
        </>
    )
}
