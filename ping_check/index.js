const ping = require("ping");
const express = require("express");

const app = express();

app.get("/", (req, res) => res.redirect("/metrics"));
app.get("/metrics", (req, res) => res.status(400).send("use: /metrics/fqdn"));
app.get("/metrics/:fqdn", async (req, res) => {
  const host = req.params.fqdn;

  try {
    const result = await ping.promise.probe(host);
    // host time avg packetLoss
    const output =
      "# HELP ping_check Latency (ms)\n# TYPE ping_check_latency gauge\n" +
      `ping_check_latency ${result.avg}\n` +
      "# HELP ping_check_packetLoss\n# TYPE ping_check_packetLoss gauge\n" +
      `ping_check_packetLoss ${result.packetLoss}\n`;

    console.log(
      `Host: ${result.inputHost} Ping: ${result.avg} ms PacketLoss: ${result.packetLoss}`
    );
    res.set("Content-Type", "text/plain");
    res.send(output);
  } catch (err) {
    res.status(500).end();
  }
});

const port = process.env.PORT || 9100;
app.listen(port, () => console.log(`Server is running on port ${port}`));
