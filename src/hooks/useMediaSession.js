import { useEffect } from 'react'
import { thumbUrl, artistName } from '../utils/song'

// Wires the OS/browser-level media widget (the one in your screenshot —
// Chrome's media popup, same API drives Android lock-screen controls and
// Windows' media overlay) to the actual player. Call this once, from
// wherever owns the real play/pause/next/previous logic — that's almost
// certainly useAudioEngine.js, since it's the thing with the <audio>
// element and already has these actions.
//
// Usage:
//   useMediaSession({
//     song,
//     isPlaying,
//     duration,
//     position: currentTime,
//     onPlay: () => audio.play(),
//     onPause: () => audio.pause(),
//     onNext: playNext,
//     onPrevious: playPrevious,
//     onSeekTo: (t) => requestSeek(t),
//   })
export function useMediaSession({
  song,
  isPlaying,
  duration,
  position,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeekTo,
}) {
  // metadata: title / artist / artwork — this is what puts the actual
  // thumbnail + song name in the widget instead of the blank Chrome icon
  useEffect(() => {
    if (!('mediaSession' in navigator) || !song) return
    const art = thumbUrl(song)
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.name || 'Unknown title',
      artist: artistName(song) || '',
      album: 'Moon',
      artwork: art
        ? [
            { src: art, sizes: '96x96', type: 'image/jpeg' },
            { src: art, sizes: '192x192', type: 'image/jpeg' },
            { src: art, sizes: '512x512', type: 'image/jpeg' },
          ]
        : [],
    })
  }, [song])

  // playbackState — the widget's pause/play icon reflects this directly
  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'
  }, [isPlaying])

  // action handlers — makes the widget's buttons actually do something
  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    const handlers = [
      ['play', onPlay],
      ['pause', onPause],
      ['previoustrack', onPrevious],
      ['nexttrack', onNext],
      ['seekto', (details) => {
        if (details?.seekTime != null) onSeekTo?.(details.seekTime)
      }],
    ]
    for (const [action, handler] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler || null)
      } catch {
        // some actions (e.g. seekto) aren't supported in every browser —
        // safe to skip rather than throw
      }
    }
    return () => {
      for (const [action] of handlers) {
        try { navigator.mediaSession.setActionHandler(action, null) } catch {}
      }
    }
  }, [onPlay, onPause, onNext, onPrevious, onSeekTo])

  // position state — powers the little progress line some widgets show
  useEffect(() => {
    if (!('mediaSession' in navigator) || !navigator.mediaSession.setPositionState) return
    if (!duration || Number.isNaN(duration)) return
    try {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate: 1,
        position: Math.min(position || 0, duration),
      })
    } catch {
      // fires occasionally mid-track-change when position > duration
      // for a split second — safe to ignore
    }
  }, [duration, position])
}