const cm = require("certificate-monitor");
const express = require("express");

const app = express();

app.get("/metrics", (req, res) => res.json({ massage: "use: /metrics/fqdn" }));
app.get("/metrics/:host", (req, res) => {
  const dateNow = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  const host = req.params.host;
  if (!host) return res.json({ message: "no host" });

  try {
    cm.checkCertificateAtURL(`https://${host}`, (certInfo) => {
      const daysLeft = Math.round(
        (certInfo.valid_to.getTime() - dateNow.getTime()) / oneDay
      );
      res.json({ daysLeft });
    });
  } catch (err) {
    res.json(err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
