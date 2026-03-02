export const runtime = "nodejs";

export default async function handler(req) {
  // 1. Define common headers
  const headers = {
    "Access-Control-Allow-Origin": "*", // Or "https://phatnguyen262008-droid.github.io" for security
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  // 2. Handle Preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // 3. Handle incorrect methods
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  }

  try {
    const body = await req.json();

    const response = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }
);

const text = await response.text();

if (!response.ok) {
  return new Response(
    JSON.stringify({
      error: "OpenRouter error",
      status: response.status,
      details: text,
    }),
    { status: response.status, headers }
  );
}

const data = JSON.parse(text);

return new Response(JSON.stringify(data), {
  status: 200,
  headers,
});

  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error", details: error.message }), {
      status: 500,
      headers,
    });
  }
}
