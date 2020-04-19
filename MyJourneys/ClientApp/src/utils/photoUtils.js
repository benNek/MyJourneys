export function getPhotoUrl(path) {
  return window.location.origin + "/" + path.split('/public/')[1];
}