import EXIF from "exif-js/exif";

/**
 * @return {number}
 */
export function convertDMSToDD(degrees, minutes, seconds, direction) {
  let dd = degrees + (minutes / 60) + (seconds / 3600);
  if (direction === "S" || direction === "W") {
    dd = dd * -1;
  }
  return dd;
}

export function resolveLatLon(file) {
  EXIF.getData(file, function () {
    if (!this.exifdata || !this.exifdata.GPSLatitude || !this.exifdata.GPSLatitude.length) {
      return;
    }
    const latDegree = this.exifdata.GPSLatitude[0].numerator;
    const latMinute = this.exifdata.GPSLatitude[1].numerator;
    const latSecond = this.exifdata.GPSLatitude[2].numerator / this.exifdata.GPSLatitude[2].denominator;
    const latDirection = this.exifdata.GPSLatitudeRef;
    const lat = convertDMSToDD(latDegree, latMinute, latSecond, latDirection);

    const lonDegree = this.exifdata.GPSLongitude[0].numerator;
    const lonMinute = this.exifdata.GPSLongitude[1].numerator;
    const lonSecond = this.exifdata.GPSLongitude[2].numerator / this.exifdata.GPSLongitude[2].denominator;
    const lonDirection = this.exifdata.GPSLongitudeRef;
    const lon = convertDMSToDD(lonDegree, lonMinute, lonSecond, lonDirection);

    file.exifdata = undefined;
    file.iptcdata = undefined;
    file.location = {lat, lon};
  });
}