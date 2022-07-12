// const indexRouter = require("./public/script");
// const authRouter = require("./routes/auth");

const express = require("express");
const app = express();
const port = 3000;
const activeUsers = require("./active_users");

app.get("/", (req, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});

app.use("/public", express.static("public"));

app.get("/api/active_users.json", activeUsers.getData);

app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});

// app.use("/", indexRouter);
// app.use("/", authRouter);
