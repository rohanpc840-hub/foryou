function playChorus() {
  const audio = getAudioElement();
  if (!audio) return;

  audio.currentTime = CHORUS_START_TIME;
  
  audio.play().then(() => {
    isAudioPlaying = true;
    updateMusicIcon(true);
  }).catch((err) => {
    console.warn('Playback blocked. Waiting for user click:', err);
    isAudioPlaying = false;
    updateMusicIcon(false);
    // Ensure the modal isn't repeatedly re-opened if it was closed
  });
}