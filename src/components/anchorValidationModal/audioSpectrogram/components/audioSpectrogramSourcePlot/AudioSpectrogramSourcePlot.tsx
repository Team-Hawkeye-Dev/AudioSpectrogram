import { useAudioSpectrogramUrl } from "../../hooks/useAudioSpectrogramUrl"
import { useAudioSpectrogramViewer } from "../../hooks/useAudioSpectrogramViewer"
import { useTimeShiftedAudioUrl } from "../../hooks/useTimeShiftedAudioUrl"
import { useZoomSelection } from "../../hooks/useZoomSelection"
import { DEFAULT_TIME_SHIFT } from "../../consts/audioSpectrogram.consts"
import type { AudioSpectrogramSource } from "../../types/audioSpectrogram.types"
import { AudioSpectrogramViewer } from "../../../../../core/components/spectrogram/audioSpectrogramViewer/AudioSpectrogramViewer"
import { MS_PER_SECOND } from "../../../../../core/components/spectrogram/audioSpectrogramViewer/consts"

export const AudioSpectrogramSourcePlot = ({
    audioGuid,
    spectrogramType,
    maxHz,
    stepHz,
    earliestStartTimeMs
}: AudioSpectrogramSource) => {
    const { audioUrl, pickingLabelData, recordingStartTimeMs } = useAudioSpectrogramUrl(audioGuid, spectrogramType)
    const timeShift = recordingStartTimeMs !== undefined && earliestStartTimeMs !== undefined
        ? (recordingStartTimeMs - earliestStartTimeMs) / MS_PER_SECOND
        : undefined
    const timeShiftedAudioUrl = useTimeShiftedAudioUrl(spectrogramType, audioGuid, audioUrl, timeShift)
    const viewer = useAudioSpectrogramViewer(timeShiftedAudioUrl, maxHz, spectrogramType, pickingLabelData, earliestStartTimeMs, timeShift ?? DEFAULT_TIME_SHIFT)
    const zoom = useZoomSelection(viewer)
    const { spectrogramContainerRef, isPlaying, detections, timeline, isReadyAudio, togglePlay, playbackPosition} = viewer 

    return (
        <>
            {audioUrl && timeline && (<AudioSpectrogramViewer
            maxHz={maxHz}
            stepHz={stepHz}
            spectrogramContainerRef={spectrogramContainerRef}
            isReadyAudio={isReadyAudio}
            zoom={zoom}
            playback={{ isPlaying, togglePlay, playbackPosition }}
            detections={detections}
            timeline={timeline}
        />)}
        </>
    )
}
