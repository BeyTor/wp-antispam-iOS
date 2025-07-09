const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ Pushcut bildirim URL'in
const PUSHCUT_URL = "https://api.pushcut.io/PN-guWHm6sinfWidNxDnO/notifications/SessizeAl";

let counters = {}; // Takip edilen göndericiler

app.post("/message", async (req, res) => {
  const sender = req.body.from?.toLowerCase() || "unknown";

  // Gönderici için sayaç arttırılıyor
  counters[sender] = (counters[sender] || 0) + 1;
  console.log(`[${new Date().toISOString()}] "${sender}" → ${counters[sender]} mesaj`);

  // 5 mesaja ulaştıysa sessize alma tetiklenir
  if (counters[sender] >= 5) {
    counters[sender] = 0;

    try {
      console.log(`📡 Pushcut'a istek gönderiliyor → ${PUSHCUT_URL}`);
      const response = await fetch(PUSHCUT_URL, { method: "POST" });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      console.log(`✅ Sessize alma tetiklendi! (${sender})`);
    } catch (err) {
      console.error("❌ Pushcut tetiklenemedi:", err.message);
    }
  }

  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready on port ${PORT}`);
});
