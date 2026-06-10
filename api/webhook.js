// PUMPA Digital — WhatsApp Webhook
// Deploy to: /api/webhook.js in your GitHub repo

const VERIFY_TOKEN = "pumpa_webhook_2026";

export default function handler(req, res) {
  
  // ── GET: Webhook Verification (Meta calls this once to verify)
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified successfully!");
      return res.status(200).send(challenge);
    } else {
      return res.status(403).json({ error: "Verification failed" });
    }
  }

  // ── POST: Receive WhatsApp Messages
  if (req.method === "POST") {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      body.entry?.forEach((entry) => {
        entry.changes?.forEach((change) => {
          const value = change.value;

          // Incoming messages
          if (value.messages) {
            value.messages.forEach((message) => {
              const from = message.from; // Customer's phone number
              const msgType = message.type;
              
              let text = "";
              if (msgType === "text") {
                text = message.text?.body || "";
              }

              console.log(`New message from ${from}: ${text}`);

              // ── AUTO-REPLY LOGIC ──
              // You can add auto-reply here later
              // For now just log incoming messages
            });
          }

          // Message status updates (delivered, read, etc.)
          if (value.statuses) {
            value.statuses.forEach((status) => {
              console.log(`Message ${status.id} status: ${status.status}`);
            });
          }
        });
      });

      return res.status(200).json({ status: "ok" });
    }

    return res.status(404).json({ error: "Not a WhatsApp event" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
