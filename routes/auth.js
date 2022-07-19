var passport = require("passport");
var GoogleStrategy = require("passport-google-oidc");

var express = require("express");

var router = express.Router();

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/login/federated/google", passport.authenticate("google"));

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = router;

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, {
      id: user.id,
      email: user.emails[0].value,
      name: user.displayName,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

/* 
import mongoose from "mongoose";
mongoose.connect('mongodb://localhost:27017/myapp');
const { Schema } = mongoose;

const dbSchema = new Schema({
  user: {
    email: String,
    sessionToken: String,
  },
});

const dbModel = mongoose.model("Model", dbSchema);

dbModel.find({'issuer': 'Google'}, {'profile.id': ClientID?}, function(err, cred))
dbModel.set()
*/
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "http://kuma.com:3000/oauth2/redirect/google",
      scope: "profile email",
    },
    function (endpoint, profile, cb) {
      console.log("doing stuff");
      console.log(endpoint);
      console.log(profile);
      console.log("finished doing stuff");
      return cb(null, profile);
    }
    //   function(issuer, profile, cb) {
    //     db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
    //       issuer,
    //       profile.id
    //     ], function(err, cred) {
    //       if (err) { return cb(err); }
    //       if (!cred) {
    //         // The Google account has not logged in to this app before.  Create a
    //         // new user record and link it to the Google account.
    //         db.run('INSERT INTO users (name) VALUES (?)', [
    //           profile.displayName
    //         ], function(err) {
    //           if (err) { return cb(err); }

    //           var id = this.lastID;
    //           db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
    //             id,
    //             issuer,
    //             profile.id
    //           ], function(err) {
    //             if (err) { return cb(err); }
    //             var user = {
    //               id: id.toString(),
    //               name: profile.displayName
    //             };
    //             return cb(null, user);
    //           });
    //         });
    //       } else {
    //         // The Google account has previously logged in to the app.  Get the
    //         // user record linked to the Google account and log the user in.
    //         db.get('SELECT * FROM users WHERE id = ?', [ cred.user_id ], function(err, user) {
    //           if (err) { return cb(err); }
    //           if (!user) { return cb(null, false); }
    //           return cb(null, user);
    //         });
    //       }
    //     };
    //   }
  )
);
