import { useEffect, useRef } from 'react'
import { usePlayer } from '../store/playerStore'
import { audioUrl } from '../utils/song'
import { audioEl } from '../audio/audioElement'
import { useMediaSession } from './useMediaSession'

// Mount this once near the root of the app. It keeps the real <audio>
// element in sync with the playerStore's intent, and pushes playback
// events (time, duration, ended, error) back into the store.
export function useAudioEngine() {
  const loadedSongRef = useRef(null)
  // always holds the *latest* seekTarget so the loadedmetadata handler
  // (registered once, empty dep array) never reads a stale closure value
  const seekTargetRef = useRef(null)

  const queue = usePlayer((s) => s.queue)
  const currentIndex = usePlayer((s) => s.currentIndex)
  const isPlaying = usePlayer((s) => s.isPlaying)
  const volume = usePlayer((s) => s.volume)
  const seekTarget = usePlayer((s) => s.seekTarget)
  const duration = usePlayer((s) => s.duration)
  const currentTime = usePlayer((s) => s.currentTime)
  const next = usePlayer((s) => s.next)
  const previous = usePlayer((s) => s.prev)
  const requestSeek = usePlayer((s) => s.requestSeek)
  const setProgress = usePlayer((s) => s.setProgress)

  const song = currentIndex >= 0 ? queue[currentIndex] : null

  useEffect(() => {
    seekTargetRef.current = seekTarget
  }, [seekTarget])

  // load a new source whenever the current song changes
  useEffect(() => {
    if (!song) return
    const url = audioUrl(song)
    if (!url) {
      // this echo has no playable source — skip forward automatically
      next()
      return
    }
    if (loadedSongRef.current !== url) {
      audioEl.src = url
      loadedSongRef.current = url
      // don't autoplay here — the isPlaying effect below is the single
      // source of truth for play/pause, so a fresh src just sits loaded
      // until that effect decides whether to start it. This also stops
      // a restored-but-paused session (e.g. after a refresh) from
      // audibly starting and then immediately pausing again.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song])

  // play / pause in response to store intent
  useEffect(() => {
    if (!audioEl.src) return
    if (isPlaying) audioEl.play().catch(() => {})
    else audioEl.pause()
  }, [isPlaying, song])

  // volume
  useEffect(() => {
    audioEl.volume = volume / 100
    audioEl.muted = false
  }, [volume])

  // seek requests coming from the seek bar (only once metadata/duration
  // is actually available — otherwise the browser just ignores it)
  useEffect(() => {
    if (seekTarget == null) return
    if (isFinite(audioEl.duration)) {
      audioEl.currentTime = seekTarget
      seekTargetRef.current = null
    }
  }, [seekTarget])

  // wire native events -> store, once
  useEffect(() => {
    const onTime = () => setProgress(audioEl.currentTime, audioEl.duration || 0)
    const onLoaded = () => {
      // this is the missing piece: a restored session's seekTarget was
      // set before the audio element had anything loaded, so the seek
      // effect above skipped it. Once metadata is ready, apply it here
      // and then clear it so it can't wrongly re-fire on a later song.
      if (seekTargetRef.current != null && isFinite(audioEl.duration)) {
        audioEl.currentTime = seekTargetRef.current
        seekTargetRef.current = null
      }
      setProgress(audioEl.currentTime, audioEl.duration || 0)
    }
    const onEnded = () => {
      // 'one' -> replay the exact same song instead of advancing.
      // 'all' / 'off' both fall through to next(); next() already wraps
      // around the queue with modulo, so 'all' needs no special case —
      // the only real difference for 'off' would be stopping at the end
      // of the queue, which this app doesn't currently do anyway.
      const { repeatMode } = usePlayer.getState()
      if (repeatMode === 'one') {
        audioEl.currentTime = 0
        audioEl.play().catch(() => {})
        return
      }
      next()
    }
    const onError = () => { if (audioEl.src) next() }

    audioEl.addEventListener('timeupdate', onTime)
    audioEl.addEventListener('loadedmetadata', onLoaded)
    audioEl.addEventListener('ended', onEnded)
    audioEl.addEventListener('error', onError)

    return () => {
      audioEl.removeEventListener('timeupdate', onTime)
      audioEl.removeEventListener('loadedmetadata', onLoaded)
      audioEl.removeEventListener('ended', onEnded)
      audioEl.removeEventListener('error', onError)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // OS/browser media widget — Chrome's media popup, Android lock-screen,
  // Windows media overlay. Feeds it the current song's thumbnail/title,
  // and wires its play/pause/next/previous/seek buttons back to the
  // exact same store intent this hook already listens to above, so
  // there's still only ever one source of truth for playback.
  useMediaSession({
    song,
    isPlaying,
    duration,
    position: currentTime,
    onPlay: () => usePlayer.setState({ isPlaying: true }),
    onPause: () => usePlayer.setState({ isPlaying: false }),
    onNext: next,
    onPrevious: previous,
    onSeekTo: (t) => requestSeek(t),
  })
}