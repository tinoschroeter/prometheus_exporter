const { exec } = require("child_process");
const express = require("express");

const app = express();

app.get("/", (req, res) => res.redirect("/metrics"));
app.get("/metrics", (req, res) => res.status(400).send("use: /metrics/fqdn"));
app.get("/metrics/:fqdn", (req, res) => {
  const host = req.params.fqdn;
  exec(`dig @8.8.8.8 A ${host}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return res.status(500).send(error);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return res.status(500).send(error);
    }

    const result = stdout.replace(/(?:\r\n|\r|\n)/g, " ").split(";;");

    result.map((item) => {
      const arr = item.split(":");
      const key = arr[0].trim();

      if (key === "Query time") {
        const result = arr[1].split(" ")[1];

        const output =
          "# HELP dns_check Latency (ms)\n# TYPE dns_check_latency gauge\n" +
          `dns_check_latency ${result}\n`;

        console.log(`Host: ${host} latency ${result} ms`);
        res.set("Content-Type", "text/plain");
        res.send(output);
      }
    });
  });
});

const port = process.env.PORT || 9100;
app.listen(port, () => console.log(`Server is running on por ${port}`));
