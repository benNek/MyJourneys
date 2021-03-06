import {convertDMSToDD, generateDirectionsUrl, getMapStyle, resolveLatLon, resolveMapBounds} from "./mapUtils";

it('converts Paris latitude DMS to DD', () => {
  expect(convertDMSToDD(48, 51, 29.1348, 'N')).toBeCloseTo(48.858093);
});

it('converts Paris longitude DMS to DD', () => {
  expect(convertDMSToDD(2, 17, 40.8984, 'E')).toBeCloseTo(2.294694);
});

it('converts Rio de Janeiro latitude DMS to DD', () => {
  expect(convertDMSToDD(22, 54, 29.1348, 'S')).toBeCloseTo(-22.908333);
});

it('converts Rio de Janeiro longitude DMS to DD', () => {
  expect(convertDMSToDD(43, 17, 40.8984, 'W')).toBeCloseTo(-43.294694);
});

it('resolves empty image EXIF lat/lon coordinates', () => {
  const file = {};
  resolveLatLon(file);
  expect(file).toEqual({});
});

it('resolves map bounds with no points', () => {
  expect(resolveMapBounds()).toEqual([]);
});

it('resolves map bounds', () => {
  const points = [
    [-10, 0],
    [0, 0],
    [10, 0],
    [0, 5],
    [0, -5]
  ];
  expect(resolveMapBounds(points)).toEqual([[-10, -5], [10, 5]]);
});

it('generate empty directions url', () => {
  expect(generateDirectionsUrl([])).toBe('');
});

it('generate valid directions url', () => {
  const places = [
    {latitude: 0, longitude: 0},
    {latitude: 10, longitude: 10},
    {latitude: 20, longitude: 20},
    {latitude: 30, longitude: 30},
  ];
  expect(generateDirectionsUrl(places)).toBe('https://www.google.com/maps/dir/?api=1&origin=0,0&destination=30,30&waypoints=10,10|20,20');
});

it('gets dark mode map style', () => {
  expect(getMapStyle(true)).toEqual('mapbox://styles/bennek/ck91w6y191la41kpmgetqg8ce');
});

it('gets light mode map style', () => {
  expect(getMapStyle(false)).toEqual('mapbox://styles/bennek/ck91vtkwy02bu1ioifdod49tt');
});