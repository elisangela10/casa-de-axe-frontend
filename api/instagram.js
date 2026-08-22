export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  const version = process.env.INSTAGRAM_GRAPH_VERSION || "v25.0";

  if (!token || !userId) {
    return response.status(503).json({ error: "Instagram integration is not configured" });
  }

  const params = new URLSearchParams({
    fields: "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
    limit: "9",
    access_token: token,
  });

  try {
    const instagramResponse = await fetch(`https://graph.facebook.com/${version}/${userId}/media?${params}`);
    const data = await instagramResponse.json();

    if (!instagramResponse.ok) {
      return response.status(instagramResponse.status).json({ error: "Instagram API request failed" });
    }

    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return response.status(200).json({ data: data.data || [] });
  } catch {
    return response.status(502).json({ error: "Unable to reach Instagram API" });
  }
}
