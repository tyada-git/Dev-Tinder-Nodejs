const express = require("express");
const userModal = require("../models/user.js");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
  const user = new userModal(req.body);

  try {
    await user.save();
    res.status(201);
    res.send("user added successfully");
  } catch (err) {
    res.status(500).send("some error occured" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModal.find({ email: email });
    console.log(user);
    if (user.length === 0) {
      return res.status(404).send("user not found");
    } else {
      const token = jwt.sign({ id: user[0]._id }, "devtindersecret");
      res.cookie("token_id", token);
      res.status(200).send("user logged in successfully");
    }
  } catch (err) {
    res.status(500).send("some error occured" + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token_id", "", (expires = new Date(0)));
  res.status(200).send("user logged out successfully");
});

module.exports = authRouter;
