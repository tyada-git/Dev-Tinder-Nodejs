const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const cors = require("cors");

const app = express();
// app.use(cors());
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || true); // allow all origins dynamically
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRouter.js");
const userRouter = require("./routes/userRouter.js");
const profileRouter = require("./routes/profileRouter.js");

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);

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
