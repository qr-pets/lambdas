import handler from './index';

it('sample test', async () => {
  const expected = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };

  const actual = await handler();

  expect(actual).toEqual(expected);
});
