export default async function handler(req, res) {
  const apiKey = process.env.REACT_APP_FD_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }
  try {
    const upstream = await fetch(
      "https://api.football-data.org/v4/competitions/WC/standings",
      { headers: { "X-Auth-Token": apiKey } }
    );
    const data = await upstream.json();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
