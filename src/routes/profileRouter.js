const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send("some error occured" + err.message);
  }
});

module.exports = profileRouter;
