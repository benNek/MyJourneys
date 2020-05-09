import {convertDMSToDD, getMapStyle, resolveMapBounds} from "./mapUtils";

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

it('gets dark mode map style', () => {
  expect(getMapStyle(true)).toEqual('mapbox://styles/bennek/ck91w6y191la41kpmgetqg8ce');
});

it('gets light mode map style', () => {
  expect(getMapStyle(false)).toEqual('mapbox://styles/bennek/ck91vtkwy02bu1ioifdod49tt');
});