console.log("dev tinder");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const userModal = require("./models/user.js");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res, next) => {
  const user = new userModal(req.body);

  try {
    await user.save();
    res.status(201);
    res.send("user added successfully");
  } catch (err) {
    res.status(500).send("some error occured" + err.message);
  }
});

//get all users by given email

app.get("/users", async (req, res) => {
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

// Feed API all the response

app.get("/feed", userAuth, async (req, res) => {
  try {
    const allUsers = await userModal.find({});
    res.status(200);
    res.send(allUsers);
  } catch (err) {
    res.status(500).send("some error occured" + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send("some error occured" + err.message);
  }
});

app.patch("/user", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

connectDB()
  .then(() => {
    console.log("db connection established..");
  })
  .catch((err) => {
    console.error("db cannot be connected");
  });

app.listen(3000, () => {
  console.log("server is up");
});
