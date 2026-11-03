import { useEffect, useState } from 'react';
import { padAudioStart } from '../utils/padAudioStart';

export const usePaddedAudioUrl = (audioUrl: string | undefined, paddingSeconds: number | undefined): string | undefined => {
  const [paddedAudioUrl, setPaddedAudioUrl] = useState<string>();

  useEffect(() => {
    if (!audioUrl || !paddingSeconds) return;

    const abortController = new AbortController();
    const paddedAudioUrlPromise = padAudioStart(audioUrl, paddingSeconds);
    void paddedAudioUrlPromise.then((url) => {
      if (!abortController.signal.aborted) setPaddedAudioUrl(url);
    });

    return () => {
      abortController.abort();
      setPaddedAudioUrl(undefined);
      void paddedAudioUrlPromise.then(URL.revokeObjectURL);
    };
  }, [audioUrl, paddingSeconds]);

  if (paddingSeconds === undefined) return undefined;
  return paddingSeconds > 0 ? paddedAudioUrl : audioUrl;
};
