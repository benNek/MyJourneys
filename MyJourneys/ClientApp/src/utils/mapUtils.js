import EXIF from "exif-js/exif";
import moment from "moment";

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
    if (!this.exifdata) {
      return;
    }

    if (this.exifdata.DateTime) {
      file.date = moment(this.exifdata.DateTime, 'YYYY:MM:DD hh:mm:ss').format();
    }

    if (this.exifdata.GPSLatitude && this.exifdata.GPSLatitude.length > 2) {
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
      file.location = {lat, lon};
    }

    file.exifdata = undefined;
    file.iptcdata = undefined;
  });
}

export function resolveMapBounds(points) {
  if (!points || !points.length) {
    return [];
  }
  
  let minLon = 999, maxLon = -999, minLat = 999, maxLat = -999;
  points.forEach(point => {
    minLon = Math.min(minLon, point[0]);
    maxLon = Math.max(maxLon, point[0]);
    minLat = Math.min(minLat, point[1]);
    maxLat = Math.max(maxLat, point[1]);
  });

  return [[minLon, minLat], [maxLon, maxLat]];
}

export function generateDirectionsUrl(places) {
  const values = Object.values(places);
  const origin = values.shift();
  const destination = values.pop();

  let waypoints = '';
  values.forEach(place =>
    waypoints += `${place.latitude},${place.longitude}|`
  );
  waypoints = waypoints.substring(0, waypoints.length - 1);

  const baseUrl = 'https://www.google.com/maps/dir/?api=1';
  const originUrl = origin ? `&origin=${origin.latitude},${origin.longitude}` : '';
  const destinationUrl = destination ? `&destination=${destination.latitude},${destination.longitude}` : '';
  const waypointsUrl = waypoints ? `&waypoints=${waypoints}` : '';

  const url = `${baseUrl}${originUrl}${destinationUrl}${waypointsUrl}`;
  if (!url.includes('origin') || !url.includes('destination')) {
    return '';
  }
  return url;
};

export function getMapStyle(darkMode) {
  return darkMode ? "mapbox://styles/bennek/ck91w6y191la41kpmgetqg8ce" : "mapbox://styles/bennek/ck91vtkwy02bu1ioifdod49tt";
}