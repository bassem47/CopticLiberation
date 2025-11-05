import { getStore } from '@netlify/blobs';

const json = (body, status = 200) => ({
  statusCode: status,
  headers: {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
  },
  body: JSON.stringify(body),
});

export async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') return json({});

  const key =
    (event.queryStringParameters && event.queryStringParameters.key) ||
    'test';

  const store = await getStore('counters', { context });

  if (event.httpMethod === 'POST') {
    const currentRaw = await store.get(key);
    const current = Number(currentRaw || 0);
    const next = current + 1;
    await store.set(key, String(next));
    return json({ key, count: next });
  }

  const raw = await store.get(key);
  const count = Number(raw || 0);
  return json({ key, count });
}
