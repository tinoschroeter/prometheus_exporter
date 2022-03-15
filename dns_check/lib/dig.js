const { exec } = require("child_process");

const dig = (host, verb = "A") => {
  exec(`dig @8.8.8.8 ${verb} ${host}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }

    const obj = {};

    const result = stdout.replace(/(?:\r\n|\r|\n)/g, " ").split(";;");

    result.map((item) => {
      const arr = item.split(":");
      const key = arr[0].trim();

      if (key === "ANSWER SECTION") {
        obj.answerSection = arr[1].replace(/\t/g, " ").trim();
      }
      if (key === "Query time") {
        obj.queryTime = arr[1].trim();
      }
      if (key === "SERVER") {
        obj.server = arr[1].trim();
      }
      if (key === "WHEN") {
        obj.when = arr[1].trim();
      }
      if (key === "MSG SIZE") {
        obj.msgSize = arr[1].trim();
      }
    });

    console.log(obj)
  });
};

module.exports = dig;
