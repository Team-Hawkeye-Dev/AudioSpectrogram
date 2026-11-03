import { useMassiviAppStore } from '../../../../store/useStore';
import { SpectrogramType } from '../consts/audioSpectrogram.consts';
import { useAudioSpectrogramUrl } from './useAudioSpectrogramUrl';

export const useEarliestStartTimeMs = (): number | undefined => {
  const spectrogramAudioGuid = useMassiviAppStore((state) => state.anchorValidationSection.spectrogramAudioGuid)
  const topUrlStatus = useAudioSpectrogramUrl(spectrogramAudioGuid[SpectrogramType.TOP], SpectrogramType.TOP)
  const bottomUrlStatus = useAudioSpectrogramUrl(spectrogramAudioGuid[SpectrogramType.BOTTOM], SpectrogramType.BOTTOM)

  if (topUrlStatus.isLoading || bottomUrlStatus.isLoading) return undefined

  const startTimesMs = [topUrlStatus.recordingStartTimeMs, bottomUrlStatus.recordingStartTimeMs]
    .filter((startTimeMs) => startTimeMs !== undefined)
  return startTimesMs.length ? Math.min(...startTimesMs) : undefined
}
