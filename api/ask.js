export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const incoming = req.body || {};
    const safeModel =
      incoming.model === "deepseek-reasoner"
        ? "deepseek-reasoner"
        : "deepseek-chat";

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...incoming,
        model: safeModel,
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "DeepSeek error",
        details: text,
      });
    }

    return res.status(200).json(JSON.parse(text));
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}
