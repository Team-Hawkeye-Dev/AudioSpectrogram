import { useEffect } from "react"
import { useSnackbar } from "notistack"
import { useMassiviAppStore } from "../../../../store/useStore"
import { SpectrogramType } from "../consts/audioSpectrogram.consts"
import { useAudioSpectrogramUrl, type AudioSpectrogramUrlStatus } from "./useAudioSpectrogramUrl"

const isSpectrogramLoaded = (
    { isFetching, audioUrl }: AudioSpectrogramUrlStatus,
    audioDuration: number,
): boolean => {
    if (isFetching) return false
    if (!audioUrl) return true
    return audioDuration > 0
}

const getSpectrogramLoadErrorMessage = (
    spectrogramType: SpectrogramType,
    error: Error
): string =>
    `Failed to load ${spectrogramType} spectrogram audio: ${error.message}`

export const useAreAllSpectrogramsReady = (): boolean => {
    const { enqueueSnackbar } = useSnackbar();
    const spectrogramAudioGuid = useMassiviAppStore((state) => state.anchorValidationSection.spectrogramAudioGuid)
    const spectrogramAudioDuration = useMassiviAppStore((state) => state.anchorValidationSection.spectrogramAudioDuration)

    const topUrlStatus = useAudioSpectrogramUrl(spectrogramAudioGuid[SpectrogramType.TOP], SpectrogramType.TOP)
    const bottomUrlStatus = useAudioSpectrogramUrl(spectrogramAudioGuid[SpectrogramType.BOTTOM], SpectrogramType.BOTTOM)

    const { error: topError } = topUrlStatus
    const { error: bottomError } = bottomUrlStatus

    useEffect(() => {
        if (topError) {
            enqueueSnackbar(
                getSpectrogramLoadErrorMessage(
                    SpectrogramType.TOP,
                    topError
                ),
                { variant: 'error' }
            )
        }

        if (bottomError) {
            enqueueSnackbar(
                getSpectrogramLoadErrorMessage(
                    SpectrogramType.BOTTOM,
                    bottomError
                ),
                { variant: 'error' }
            )
        }
    }, [enqueueSnackbar, topError, bottomError])

    const isTopSpectrogramReady = isSpectrogramLoaded(topUrlStatus, spectrogramAudioDuration[SpectrogramType.TOP])
    const isBottomSpectrogramReady = isSpectrogramLoaded(bottomUrlStatus, spectrogramAudioDuration[SpectrogramType.BOTTOM])

    return isTopSpectrogramReady && isBottomSpectrogramReady
}
