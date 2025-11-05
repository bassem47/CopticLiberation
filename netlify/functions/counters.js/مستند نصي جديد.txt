export default async (req, context) => {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get("key") || "default";
    const path = `counters/${key}`;
    const blobs = context.blobs;

    const readCount = async () => {
      const res = await blobs.get(path);
      if (!res || !res.body) return 0;
      const text = await res.text();
      const n = parseInt(text, 10);
      return Number.isFinite(n) ? n : 0;
    };

    if (req.method === "GET") {
      const count = await readCount();
      return new Response(JSON.stringify({ count }), {
        headers: { "content-type": "application/json" },
      });
    }

    if (req.method === "POST") {
      let count = await readCount();
      count += 1;
      await blobs.set(path, String(count), { contentType: "text/plain" });
      return new Response(JSON.stringify({ count }), {
        headers: { "content-type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};
