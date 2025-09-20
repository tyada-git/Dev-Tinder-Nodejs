const userModal = require("../models/user.js");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token_id;
    if (!token) {
      return res.status(401).send("unauthenticated user no token");
    }
    const verifyUserFromToken = await jwt.verify(token, "devtindersecret");

    const isUserPresent = await userModal.findById({
      _id: verifyUserFromToken.id,
    });

    if (isUserPresent) {
      req.user = isUserPresent;
      next();
    } else {
      res.status(401).send("unauthenticated user");
    }
  } catch (err) {
    res.status(500).send("some error occured" + err.message);
  }
};

module.exports = { userAuth };
