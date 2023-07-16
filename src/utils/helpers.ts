export function convertDegreeToBoxShadowOffset(angleInDegree: number, distance: number) {
  angleInDegree -= 90;

  // Ensure angleInDegree is within 0-360 degree range
  if (angleInDegree < 0) {
    angleInDegree += 360;
  }
  // Convert angle from degrees to radians
  const angleInRadians = angleInDegree * (Math.PI / 180);

  // Calculate x and y offsets
  const offsetX = Math.floor(distance * Math.cos(angleInRadians));
  const offsetY = Math.floor(distance * Math.sin(angleInRadians)); // Negate y offset to match CSS conventions

  return { offsetX, offsetY };
}

export function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = (time % 60).toFixed(2);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(5, '0')}`; // format time to MM:SS.SS
}

export function formatHumanReadableTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const minuteStr = minutes === 1 ? 'minute' : 'minutes';
  const secondStr = seconds === 1 ? 'second' : 'seconds';

  if (minutes === 0) {
    return `${seconds.toFixed(2)} ${secondStr}`;
  }

  return `${minutes} ${minuteStr} and ${seconds.toFixed(2)} ${secondStr}`;
}
