export async function handler(event) {
  const key = event.queryStringParameters.key || "default";
  let count = 0;

  count += 1;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({ key, count }),
  };
}
