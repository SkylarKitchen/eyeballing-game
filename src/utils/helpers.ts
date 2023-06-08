export function convertDegreeToBoxShadowOffset(angleInDegree: number, distance: number) {
  angleInDegree -= 90;

  // Ensure angleInDegree is within 0-360 degree range
  if (angleInDegree < 0) {
    angleInDegree += 360;
  }
  // Convert angle from degrees to radians
  let angleInRadians = angleInDegree * (Math.PI / 180);

  // Calculate x and y offsets
  let offsetX = Math.floor(distance * Math.cos(angleInRadians));
  let offsetY = Math.floor(distance * Math.sin(angleInRadians)); // Negate y offset to match CSS conventions

  return { offsetX, offsetY };
}
