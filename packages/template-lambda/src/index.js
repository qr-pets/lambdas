export default async () => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambd!!!!'),
  };
  return response;
};