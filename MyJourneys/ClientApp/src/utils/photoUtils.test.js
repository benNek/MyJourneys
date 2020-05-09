import {getPhotoUrl} from "./photoUtils";

it('get photo url valid', () => {
  global.window = {
    location: {
      origin: "https://test.org"
    }
  };
  expect(getPhotoUrl('/public/image.png')).toEqual('https://test.org/image.png');
});
