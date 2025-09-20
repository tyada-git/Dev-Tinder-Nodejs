const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const userModal = require("../models/user.js");
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const allUsers = await userModal.find({});
    res.status(200);
    res.json(allUsers);
  } catch (err) {
    res.status(500).send("some error occured" + err.message);
  }
});

userRouter.get("/users", async (req, res) => {
  const email = req.body.email;
  try {
    const userFound = await userModal.find({ email: email });
    if (userFound.length === 0) {
      return res.status(404).send("user not found");
    } else {
      res.status(200);
      res.send("user fetched successfully" + userFound);
    }
  } catch (err) {
    res.status(500).send("some error occured" + err.message);
  }
});

userRouter.patch("/user", async (req, res) => {
  const id = req.body.id;
  const updates = req.body;
  const allowedUpdates = ["age"];
  try {
    await userModal.findByIdAndUpdate(id, updates);
    // const isValidOperation = updates.every((update) =>
    //   allowedUpdates.includes(update)
    // );
    res.status(200);
    res.send("user updated successfully");
  } catch (err) {
    res.status(500).send("some error occured" + err.message);
  }
});
module.exports = userRouter;
