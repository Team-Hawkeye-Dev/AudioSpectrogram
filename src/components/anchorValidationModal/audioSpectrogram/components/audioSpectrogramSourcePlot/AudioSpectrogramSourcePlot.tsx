import { useAudioSpectrogramUrl } from "../../hooks/useAudioSpectrogramUrl"
import { useAudioSpectrogramViewer } from "../../hooks/useAudioSpectrogramViewer"
import { useZoomSelection } from "../../hooks/useZoomSelection"
import { useMeasureSelection } from "../../hooks/useMeasureSelection"
import { SPECTROGRAM_TITLE } from "../../consts/audioSpectrogram.consts"
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
    const { spectrogramContainerRef, waveSurferInstanceRef, isPlaying, detections, isReadyAudio, togglePlay, playbackPosition} = viewer 
    const measure = useMeasureSelection({
        spectrogramContainerRef,
        waveSurferInstanceRef,
        spectrogramPlotType: spectrogramType,
        isReadyAudio,
        maxFrequencyHz: maxHz,
    })

    return (
        <>
            {audioGuid && (<AudioSpectrogramViewer
            title={SPECTROGRAM_TITLE[spectrogramType]}
            maxHz={maxHz}
            stepHz={stepHz}
            spectrogramContainerRef={spectrogramContainerRef}
            isReadyAudio={isReadyAudio}
            zoom={zoom}
            measure={measure}
            playback={{ isPlaying, togglePlay, playbackPosition }}
            detections={detections}
        />)}
        </>
    )
}
