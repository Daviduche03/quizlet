import type { OpenAIChatMessage } from "@/lib/openai/types";

const DEFAULT_BASE = "https://api.openai.com/v1";

function getConfig() {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim();
  const rawBase =
    process.env.EXPO_PUBLIC_OPENAI_BASE_URL?.trim() || DEFAULT_BASE;
  const baseUrl = rawBase.replace(/\/$/, "");
  const model = process.env.EXPO_PUBLIC_OPENAI_MODEL?.trim() || "gpt-4o-mini";
  return { apiKey, baseUrl, model };
}

export function assertOpenAIConfigured(): void {
  const { apiKey } = getConfig();

  if (!apiKey) {
    throw new Error(
      "OpenAI is not configured. Set EXPO_PUBLIC_OPENAI_API_KEY in your .env and restart Expo.",
    );
  }
}

export async function createChatCompletion(
  messages: OpenAIChatMessage[],
): Promise<string> {
  const { apiKey, baseUrl, model } = getConfig();
  if (!apiKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_OPENAI_API_KEY. Add it to .env (see .env.example) and rebuild.",
    );
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(
      `OpenAI request failed (${res.status}): ${raw.slice(0, 500)}`,
    );
  }

  let data: { choices?: { message?: { content?: string | null } }[] };
  try {
    data = JSON.parse(raw) as typeof data;
  } catch {
    throw new Error("OpenAI returned invalid JSON.");
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenAI returned an empty message.");
  }

  return content;
}

type StreamingChatOptions = {
  onDelta?: (delta: string, fullText: string) => void;
  signal?: AbortSignal;
};

export async function createStreamingChatCompletion(
  messages: OpenAIChatMessage[],
  options: StreamingChatOptions = {},
): Promise<string> {
  const { apiKey, baseUrl, model } = getConfig();
  if (!apiKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_OPENAI_API_KEY. Add it to .env (see .env.example) and rebuild.",
    );
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      stream: true,
    }),
    signal: options.signal,
  });

  if (!res.ok) {
    const raw = await res.text().catch(() => "");
    throw new Error(
      `OpenAI request failed (${res.status}): ${raw.slice(0, 500)}`,
    );
  }

  let buffer = "";
  let fullText = "";

  const applyPayload = (payload: string): boolean => {
    if (payload === "[DONE]") {
      return true;
    }

    try {
      const data = JSON.parse(payload) as {
        choices?: { delta?: { content?: string | null } }[];
      };
      const delta = data.choices?.[0]?.delta?.content;
      if (delta) {
        fullText += delta;
        options.onDelta?.(delta, fullText);
      }
    } catch {
      // Ignore malformed stream keepalive fragments and keep reading.
    }

    return false;
  };

  const readLines = (chunk: string): boolean => {
    buffer += chunk;
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || !line.startsWith("data:")) continue;

      const payload = line.replace(/^data:\s*/, "");
      if (applyPayload(payload)) {
        return true;
      }
    }

    return false;
  };

  if (!res.body || !("getReader" in res.body)) {
    readLines(await res.text());
    const bufferedText = fullText.trim();
    if (!bufferedText) {
      throw new Error("OpenAI returned an empty message.");
    }
    return bufferedText;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    if (readLines(decoder.decode(value, { stream: true }))) {
      return fullText.trim();
    }
  }

  const finalText = fullText.trim();
  if (!finalText) {
    throw new Error("OpenAI returned an empty message.");
  }

  return finalText;
}
