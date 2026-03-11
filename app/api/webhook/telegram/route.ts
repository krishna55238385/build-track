import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Telegram webhook receiver for BuildTrack AI.
 * Receives updates from Telegram, optionally validates token, and forwards to n8n
 * or stores for processing. n8n handles: text parsing, voice transcription, bill OCR,
 * and inserting expenses into Supabase.
 *
 * Set TELEGRAM_BOT_TOKEN in env and configure Telegram to send updates to:
 *   https://your-domain.com/api/webhook/telegram
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Telegram sends { update_id, message, ... }
    const updateId = body.update_id;
    const message = body.message;
    if (!message) {
      return NextResponse.json({ ok: true }); // acknowledge other update types
    }

    const chatId = message.chat?.id;
    const text = message.text;
    const voice = message.voice;
    const photo = message.photo;

    // Optional: validate bot token from query or header
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (token) {
      const authHeader = request.headers.get("x-telegram-bot-api-secret-token");
      const urlToken = new URL(request.url).searchParams.get("secret");
      if (authHeader !== token && urlToken !== token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Forward to n8n if configured (n8n will do AI parsing, OCR, and Supabase insert)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      const n8nRes = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "telegram",
          update_id: updateId,
          chat_id: chatId,
          message: {
            text,
            voice: voice ? { file_id: voice.file_id } : undefined,
            photo: photo?.length ? photo[photo.length - 1] : undefined,
          },
        }),
      });
      if (!n8nRes.ok) {
        console.error("n8n webhook error", n8nRes.status, await n8nRes.text());
      }
    }

    // Optionally log raw input to Supabase for debugging (use service role if unauthenticated)
    const logToSupabase = process.env.LOG_WEBHOOK_TO_SUPABASE === "true";
    if (logToSupabase) {
      try {
        const supabase = await createClient();
        if (supabase) {
          await supabase.from("activity_log").insert({
          event_type: "telegram_webhook",
          raw_input: JSON.stringify({ update_id: updateId, chat_id: chatId, has_text: !!text, has_voice: !!voice, has_photo: !!photo }),
          status: "received",
          });
        }
      } catch (_) {
        // ignore
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Telegram webhook error", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
