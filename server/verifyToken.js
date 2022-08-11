const jwt = require("jsonwebtoken");
const User = require("./models/User");

async function verify(req, res, next) {
  const authHeader = req.headers.token;
  try {
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      if (decode) {
        const user = await User.findById(decode.id).select("-password");
        if (user) {
          req.user = user;
          next();
        } else {
          req.json({ message: "in-valid id" });
        }
      } else {
        res.json("Not Valid Token!");
      }
    } else {
      return res.json("Your are not Authenticated!!");
    }
  } catch (err) {
    return res.json({ message: "catch error from verify", err });
  }
}

module.exports = verify;
