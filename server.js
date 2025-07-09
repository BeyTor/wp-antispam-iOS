const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PUSHCUT_URL = "https://api.pushcut.io/PN-.../notifications/MyNotification"; // <-- Pushcut Webhook'un buraya

let counters = {};

app.post("/message", async (req, res) => {
  const sender = req.body.from?.toLowerCase() || "unknown";

  counters[sender] = (counters[sender] || 0) + 1;
  console.log(`[${new Date().toISOString()}] ${sender} → ${counters[sender]} mesaj`);

  if (counters[sender] >= 5) {
    counters[sender] = 0;

    try {
      await fetch(PUSHCUT_URL, { method: "POST" });
      console.log(`📨 Sessize alma tetiklendi! (${sender})`);
    } catch (err) {
      console.error("❌ Pushcut tetiklenemedi:", err);
    }
  }

  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready on port ${PORT}`);
});
