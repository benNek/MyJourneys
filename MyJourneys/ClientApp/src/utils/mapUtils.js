/**
 * @return {number}
 */
export function convertDMSToDD(degrees, minutes, seconds, direction) {
  let dd = degrees + (minutes/60) + (seconds/3600);
  if (direction === "S" || direction === "W") {
    dd = dd * -1;
  }
  return dd;
}