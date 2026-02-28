export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // Đảm bảo lấy được mảng tin nhắn kể cả khi web gửi sai cấu trúc
    const userMessages = req.body.messages || [];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://thptlqd-12a1.vercel.app", 
        "X-Title": "AI Hoc Tap"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: userMessages // Sử dụng mảng đã kiểm tra ở trên
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Lỗi kết nối: " + error.message });
  }
}
