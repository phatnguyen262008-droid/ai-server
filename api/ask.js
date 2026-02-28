export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // Ép buộc sử dụng model Gemini 2.0 Flash Free để kiểm tra xem có chạy không
    const payload = {
      model: "google/gemini-2.0-flash-exp:free",
      messages: req.body.messages, // Chỉ lấy mảng tin nhắn từ web gửi lên
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/", // Yêu cầu bắt buộc của OpenRouter
        "X-Title": "AI Hoc Tap"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    // Nếu OpenRouter trả về lỗi, chuyển lỗi đó về cho trình duyệt xem luôn
    if (data.error) {
       return res.status(400).json({ error_from_api: data.error });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Lỗi kết nối Server: " + error.message });
  }
}
