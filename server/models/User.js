const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: {
      type: String,
      default:
        "https://pro2-bar-s3-cdn-cf1.myportfolio.com/dddb0c1b4ab622854dd81280840458d3/92995677ac0aab719760c33c_rw_600.png?h=c453d5442731bca5c02fcc8a4542af57",
    },
    isAdmin: { type: Boolean, default: false },
    confirmEmail: { type: Boolean, default: false },
    favMovies: { type: Array, default: [] },
    subscription_status : {type:String , default: ""}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
