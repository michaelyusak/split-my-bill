export function ParseGoDuration(duration: string): { value: string; unit: string } {
  const match = duration.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
  if (!match) return { value: "0", unit: "m" };

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  const totalMinutes = hours * 60 + minutes + seconds / 60;

  // Convert to largest fitting unit
  if (totalMinutes % (7 * 24 * 60) === 0) {
    return { value: String(totalMinutes / (7 * 24 * 60)), unit: "w" };
  } else if (totalMinutes % (24 * 60) === 0) {
    return { value: String(totalMinutes / (24 * 60)), unit: "d" };
  } else if (totalMinutes % 60 === 0) {
    return { value: String(totalMinutes / 60), unit: "h" };
  } else {
    return { value: String(Math.round(totalMinutes)), unit: "m" };
  }
}