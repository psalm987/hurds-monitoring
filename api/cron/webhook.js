import { supabase } from "../../src/lib/supabase.js";

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { error } = await supabase.from("report").select("id").limit(1);

  if (error) {
    return res.status(502).json({ error: error.message });
  }

  return res.status(200).json({ ok: true });
}
