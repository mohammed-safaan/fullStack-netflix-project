const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const validationMethod = require("../MiddleWear/validationMethod");
const senderEmail = require("../MiddleWear/confirmEmailMethod");
const { signupValidation } = require("./authValidation/registerValidation");

// Register
router.post(
  "/register",
  validationMethod(signupValidation),
  async (req, res) => {
    try {
      const find = await User.findOne({ email: req.body.email });
      if (find) {
        res.json({ message: "email exists" });
      } else {
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_KEY
          ).toString(),
        });
        const user = await newUser.save();
        // confirmation token
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        // const url = `http://localhost:8800/api/auth/confirmemail/${token}`;
        // const message = `
        // <h2>Pleaser verify your email address</h2>
        // <p>Your account is almost ready, just verify your email address to complete your subscribtion.</p>
        // <a href=${url} style='color: white;
        // font-size: 20px;
        // font-weight: bold;
        // background-color: red;
        // padding: 10px 20px;
        // text-decoration: none;
        // display: inline-block;'>
        // Verify
        // </a>
        // `;
        // await senderEmail(user.email, message);
        const { password, ...info } = user._doc;
        res.status(201).json({ message: "Done", ...info });
      }
    } catch (err) {
      res.status(500).json({ message: "catch error from register", err });
    }
  }
);

router.get("/confirmemail/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const find = await User.findByIdAndUpdate(
      { _id: decode.id },
      { confirmEmail: true },
      { new: true }
    );
    res.redirect("http://localhost:3000/login");
  } catch (err) {
    res.json({ message: "catch error from confrim email", err });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (user) {
      if (user.confirmEmail) {
        const bytes = CryptoJS.AES.decrypt(
          user.password,
          process.env.SECRET_KEY
        );
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        if (originalPassword === req.body.password) {
          const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY,
            { expiresIn: "50d" }
          );
          const { password, ...info } = user._doc;
          res
            .status(200)
            .json({ ...info, token: accessToken, message: "Done" });
        } else {
          res.json({ mes: "Wrong password!" });
        }
      } else {
        res.json({ mes: "Please confirm your email first!" });
      }
    } else {
      res.json({ mes: "Wrong email!" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
