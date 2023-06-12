export function formatTime(time: number): string {
  const minutes = Math.floor(time / 60) || 0;
  const seconds = Math.floor(time % 60) || 0;

  const formattedMinutes = minutes < 9 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function formatPlayerProgress(seek: number, duration: number): string {
  return `${(seek / duration) * 100}%`;
}
