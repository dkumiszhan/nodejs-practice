var mongoose = require("mongoose");

console.log("hello world");

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  propertyIds: [String],
  role: String,
});

const User = mongoose.model("Users", userSchema);

/*
const user1 = new users({
  email: "darkhanu@gmail.com",
  propertyId: ["111"],
});
*/

function saveUser(email, propertyIds, role) {
  return User.updateOne(
    { email: email },
    { propertyIds: propertyIds },
    { role: role },
    { upsert: true }
  ).then((value) => {
    console.log("finished " + JSON.stringify(value));
    return value;
  });
}

function findUser(email) {
  return User.findOne({ email: email }).then((value) => {
    console.log("findUser() Repsonse " + JSON.stringify(value));
    return value;
  });
}

function findAll() {
  return User.find({}).then((value) => {
    console.log("findAll() response " + JSON.stringify(value));
    return value;
  });
}

/*
users.updateOne(
  { email: "d.kumiszhan@gmail.com" },
  { propertyId: ["111"] },
  { upsert: true }
);
*/
//console.log(`user1 is ${User}`);
//user1.save();

//module.exports = mongoose.model("User", userSchema);
console.log("all done");
// console.log(findUser("asdfasdf@asdfasd.com"));
// saveUser("test@gmail.com", ["123", "234"]);

module.exports = { saveUser, findUser, findAll };
