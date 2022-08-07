// const indexRouter = require("./public/script");
// const authRouter = require("./routes/auth");
const auth = require("./routes/auth");
const userDao = require("./userDao");

const express = require("express");
const passport = require("passport");
const app = express();
app.set("view engine", "html");
const port = 3000;
const activeUsers = require("./active_users");

const session = require("express-session");
const MongoStore = require("connect-mongo");

var mongoose = require("mongoose");

mongoose.connect(
  "mongodb://root:root_password@localhost:27017/emily?authSource=admin"
);

app.use(express.json());

app.use(
  session({
    secret: "foo",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.authenticate("session"));

app.use("/", auth.requireAuth, auth.router);

app.get("/users/me", auth.requireAuth, function (req, res) {
  userDao
    .findUser(req.user.email)
    .then((data) => {
      res.end(JSON.stringify(data));
    })
    .catch((error) => {
      res.status(500);
      res.end(JSON.stringify(error));
    });
});

app.get("/admin/propertyIds", auth.requireRole("admin"), function (req, res) {
  userDao
    .findAll()
    .then((data) => {
      res.end(JSON.stringify(data));
    })
    .catch((error) => {
      res.status(500);
      res.end(JSON.stringify(error));
    });
});

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
