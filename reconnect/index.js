const { MongoClient } = require("mongodb");
const express = require("express");
const { format } = require("date-fns");

const app = express();
const uri = process.env.MONGO_URI;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

MongoClient(uri, options)
  .connect()
  .then((client) => {
    const collection = client.db("ops").collection("ip");
    app.get("/", (req, res) => res.redirect("/metrics"));
    app.get("/metrics", (req, res) => {
      collection
        .find({ date: { $regex: format(new Date(), "dd/MM/yyyy") } })
        .toArray()
        .then((result) => {
          const output =
            "# HELP internet_reconnect (count)\n# TYPE internet_reconnect gauge\n" +
            `internet_reconnect ${result.length}\n`;

          res.set("Content-Type", "text/plain");
          res.send(output);
        })
        .catch((e) => {
          console.error(e);
          res.status(500).end();
        });
    });
  });

const port = process.env.PORT || 9100;
app.listen(port, () => console.log(`Server is running on Port ${port}`));
