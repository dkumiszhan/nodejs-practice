const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});

app.use("/public", express.static("public"));

app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});
