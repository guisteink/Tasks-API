const express = require("express");
const UserModel = require("../model/UserModel");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authConfig = require("../config/auth.json");
const jwt = require("jsonwebtoken");

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

/**
 * Register
 */
router.post("/register", async (req, res) => {
  const { name } = req.body;

  try {
    if (await UserModel.findOne({ name }))
      return res.status(400).send({ error: "User already exists" });

    const user = await UserModel.create(req.body);

    user.password = undefined;

    return res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" });
  }
});

/**
 * Authentication
 */
router.post("/authenticate", async (req, res) => {
  const { name, password } = req.body;
  const user = await UserModel.findOne({ name }).select("+password");
  try {
    if (user) {
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(400).send({ error: "Invalid password" });
      }
      user.password = undefined;

      return res.send({ user, token: generateToken({ id: user.id }) });
    } else {
      return res.status(400).send({ error: "User not found" });
    }
  } catch (err) {
    return res.status(400).send({ error: "User not found" });
  }
});

module.exports = (server) => server.use("/auth", router);
