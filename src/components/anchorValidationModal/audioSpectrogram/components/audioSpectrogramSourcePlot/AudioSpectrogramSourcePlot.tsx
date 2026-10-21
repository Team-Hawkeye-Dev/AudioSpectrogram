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
    const viewer = useAudioSpectrogramViewer(audioUrl, maxHz, spectrogramType)
    const zoom = useZoomSelection(viewer)

    if (!audioUrl) return null
    return (
        <AudioSpectrogramViewer
            maxHz={maxHz}
            stepHz={stepHz}
            spectrogramContainerRef={viewer.spectrogramContainerRef}
            isReadyAudio={viewer.isReadyAudio}
            zoom={zoom}
        />
    )
}
