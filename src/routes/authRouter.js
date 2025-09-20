const express = require("express");
const userModal = require("../models/user.js");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
  const user = new userModal(req.body);

  try {
    await user.save();
    res.status(201);
    res.json({ message: "user added successfully", status: 201 });
  } catch (err) {
    res.status(500).send("some error occured" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModal.findOne({ email: email });
    console.log(user);
    if (user === null) {
      return res.status(404).send("user not found");
    } else {
      const token = jwt.sign({ id: user._id }, "devtindersecret");
      res.cookie("token_id", token, {
        httpOnly: true, // safer: not accessible in JS
        secure: false, // true if using HTTPS
        sameSite: "Lax", // needed for cross-site cookies
      });

      res.status(200);
      res.json({
        firstName: user.firstName,
        message: user.firstName + " logged in successfully",
        status: 200,
      });
    }
  } catch (err) {
    res.status(500).send("some error occured" + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token_id", "", (expires = new Date(0)));
  res.status(200).send("user logged out successfully");
});

const products = [
  { name: "iPhone 13", brand: "Apple", category: "Smartphone", price: 799 },
  {
    name: "iPhone 14 Pro",
    brand: "Apple",
    category: "Smartphone",
    price: 1099,
  },
  {
    name: "iPhone 12 Case",
    brand: "Spigen",
    category: "Accessory",
    price: 29,
  },
  {
    name: "iPhone Charger",
    brand: "Apple",
    category: "Accessory",
    price: 19,
  },
  { name: "iPad Air", brand: "Apple", category: "Tablet", price: 599 },
  {
    name: "MacBook Pro 14",
    brand: "Apple",
    category: "Laptop",
    price: 1999,
  },
  {
    name: "Samsung Galaxy S23",
    brand: "Samsung",
    category: "Smartphone",
    price: 999,
  },
  {
    name: "Samsung Charger",
    brand: "Samsung",
    category: "Accessory",
    price: 18,
  },
  { name: "Pixel 7", brand: "Google", category: "Smartphone", price: 649 },
  {
    name: "Pixel Buds Pro",
    brand: "Google",
    category: "Accessory",
    price: 199,
  },
];
authRouter.post("/product", (req, res) => {
  const query = req.body.query;
  console.log(query);
  const filteredProducts = products.filter((p) => {
    if (p.name.toLowerCase().includes(query.toLowerCase())) {
      return p;
    }
  });
  console.log(filteredProducts);
  res.json({ products: filteredProducts });
});
module.exports = authRouter;
