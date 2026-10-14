export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const webhookUrl = process.env.VITE_SUPABASE_URL
    ? process.env.VITE_SUPABASE_URL + "/functions/v1/chat"
    : undefined;

  if (!webhookUrl) {
    return res.status(500).json({ error: "WEBHOOK_URL is not set" });
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "vercel-cron",
      ranAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    return res
      .status(502)
      .json({ error: "Webhook failed", status: response.status });
  }

  return res.status(200).json({ ok: true });
}
