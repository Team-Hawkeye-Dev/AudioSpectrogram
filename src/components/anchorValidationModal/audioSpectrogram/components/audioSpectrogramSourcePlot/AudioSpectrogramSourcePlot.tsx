import { useAudioSpectrogramUrl } from "../../hooks/useAudioSpectrogramUrl"
import { useAudioSpectrogramViewer } from "../../hooks/useAudioSpectrogramViewer"
import { usePaddedAudioUrl } from "../../hooks/usePaddedAudioUrl"
import { useZoomSelection } from "../../hooks/useZoomSelection"
import type { AudioSpectrogramSource } from "../../types/audioSpectrogram.types"
import { createSpectrogramTimeline } from "../../utils/createSpectrogramTimeline"
import { AudioSpectrogramViewer } from "../../../../../core/components/spectrogram/audioSpectrogramViewer/AudioSpectrogramViewer"

export const AudioSpectrogramSourcePlot = ({
    audioGuid,
    spectrogramType,
    maxHz,
    stepHz,
    earliestStartTimeMs
}: AudioSpectrogramSource) => {
    const { audioUrl, pickingLabelData, recordingStartTimeMs } = useAudioSpectrogramUrl(audioGuid, spectrogramType)
    const timeline = createSpectrogramTimeline(recordingStartTimeMs, earliestStartTimeMs)
    const paddedAudioUrl = usePaddedAudioUrl(audioUrl, timeline?.recordingStartTime)
    const viewer = useAudioSpectrogramViewer(paddedAudioUrl, maxHz, spectrogramType, pickingLabelData, timeline)
    const zoom = useZoomSelection(viewer)
    const { spectrogramContainerRef, isPlaying, detections, timeline: timelineControls, isReadyAudio, togglePlay, playbackPosition} = viewer 

    return (
        <>
            {audioUrl && timelineControls && (<AudioSpectrogramViewer
            maxHz={maxHz}
            stepHz={stepHz}
            spectrogramContainerRef={spectrogramContainerRef}
            isReadyAudio={isReadyAudio}
            zoom={zoom}
            playback={{ isPlaying, togglePlay, playbackPosition }}
            detections={detections}
            timeline={timelineControls}
        />)}
        </>
    )
}
