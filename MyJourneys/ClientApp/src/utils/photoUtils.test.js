import {getPhotoUrl} from "./photoUtils";

it('get photo url valid', () => {
  expect(getPhotoUrl('/public/image.png')).toEqual('http://localhost/image.png');
});
