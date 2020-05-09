import {readingTime} from "./readingTime";

const text = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sollicitudin sed ligula a porttitor. Nam lectus dolor, blandit sed justo quis, consequat varius elit. Etiam quis ultrices ante, sed varius velit. Nullam blandit nulla id consectetur finibus. Ut maximus arcu a nulla consectetur interdum. Pellentesque orci erat, cursus a mauris vitae, congue cursus dui. Etiam eu viverra velit, vel pellentesque ex. Aliquam facilisis ligula nibh, eu rhoncus sapien venenatis sed. Sed ultrices sollicitudin nibh, a aliquam sem maximus sed. In quis ligula quis dolor volutpat aliquam quis vitae nulla.
    Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec gravida tellus sed vestibulum vulputate. Quisque eleifend viverra est in efficitur. Duis nec tortor turpis. Donec lacus dui, consectetur vel egestas vitae, semper vel nisi. Vivamus finibus nisl sapien, eget accumsan tellus laoreet at. Ut odio orci, vehicula id est nec, consectetur vehicula nulla. Quisque vitae ligula orci. Sed vel nulla id nisl sodales consequat in ut arcu. Donec et metus at nibh hendrerit feugiat. Praesent vehicula finibus justo, eget porta leo accumsan dictum. Maecenas eu gravida massa, tincidunt convallis neque.
    In rhoncus gravida felis vitae porttitor. Nunc pharetra, libero eget rutrum auctor, neque erat malesuada leo, nec fermentum dolor dui a nunc. Praesent nec leo commodo, mattis dolor in, rhoncus velit. Quisque aliquam purus ut eros pulvinar, eget fringilla leo tristique. Praesent auctor odio at justo efficitur, sit amet viverra nisi auctor. Maecenas maximus, enim nec posuere laoreet, ligula eros suscipit diam, eget cursus lacus risus id justo. Vestibulum dolor augue, euismod nec ipsum nec, tincidunt tincidunt massa. Donec non sodales odio. Vivamus at mauris et ligula euismod ultricies. Aenean ac fermentum ante, vel finibus libero. Etiam ut ante accumsan, rhoncus purus sit amet, cursus mauris. Suspendisse lectus turpis, semper accumsan nisi nec, euismod sollicitudin ipsum. Vestibulum eu orci tincidunt, blandit augue in, vehicula tortor. Aliquam vel turpis vitae metus rutrum sagittis.
    Mauris lacus magna, molestie non eros sit amet, volutpat egestas nulla. Pellentesque eu turpis et risus laoreet consequat vel et quam. Nulla semper sem non suscipit pulvinar. Sed commodo quis erat et vulputate. Duis sagittis magna eget risus feugiat luctus. Aliquam porta velit ac sem viverra malesuada. Sed consectetur interdum maximus. Nunc suscipit mollis ex ac tempus.
    Proin at convallis odio, at blandit dui. Vestibulum tellus mauris, hendrerit sit amet tellus eget, bibendum dictum mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam rutrum justo at nunc euismod pretium. Integer a tincidunt justo, eget molestie nisi. Donec gravida efficitur neque eget faucibus. Fusce quis metus lacus. Donec congue ligula nisi, a luctus ex pellentesque a. Vestibulum convallis aliquam dui eu pulvinar. Cras varius, lacus at vestibulum faucibus, mi arcu mollis nisl, id ultricies eros enim et nisl. Morbi pellentesque, velit sollicitudin dictum porta, nunc nibh elementum est, sed vulputate neque sapien non arcu. Phasellus eros dui, aliquam et est non, cursus tempus ex. Cras molestie aliquet dui, et malesuada augue bibendum ac. Nam vitae massa vel mauris condimentum sodales quis nec massa.
  `;

it('get reading time default', () => {
  const result = readingTime(text);
  expect(result.minutes).toBeCloseTo(2.48);
  expect(result.words).toEqual(496);
  expect(result.text).toEqual("3 min read");
});

it('get reading time slow (100 wpm)', () => {
  const result = readingTime(text, {wordsPerMinute: 100});
  expect(result.minutes).toBeCloseTo(4.96);
  expect(result.words).toEqual(496);
  expect(result.text).toEqual("5 min read");
});

it('get reading time fast (300 wpm)', () => {
  const result = readingTime(text, {wordsPerMinute: 300});
  expect(result.minutes).toBeCloseTo(1.65);
  expect(result.words).toEqual(496);
  expect(result.text).toEqual("2 min read");
});