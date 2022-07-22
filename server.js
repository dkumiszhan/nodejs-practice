// const indexRouter = require("./public/script");
// const authRouter = require("./routes/auth");
const auth = require("./routes/auth");

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

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: String,
});

var User = mongoose.model("user", userSchema);

// const { Schema } = mongoose;

// console.log({ Schema });

// const dbSchema = new Schema({
//   user: {
//     email: String,
//     sessionToken: String,
//   },
// });

// console.log(dbSchema);

// const dbModel = mongoose.model("Model", dbSchema);
// console.log(dbModel);

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

app.use("/", auth);

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
