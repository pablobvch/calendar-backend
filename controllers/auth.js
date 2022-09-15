const { response } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { createJWT } = require("../helper/jwt");

const createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let userFound = await User.findOne({ email });

    if (userFound) {
      return res.status(400).json({
        ok: false,
        msg: "There is an user with this email"
      });
    }

    const user = new User(req.body);

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    const token = await createJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "There was an error by adding the user. Please contact the administrator"
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(400).json({
        ok: false,
        msg: "There is no a user with this email"
      });
    }

    const validPassword = bcrypt.compareSync(password, userFound.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Incorrect password"
      });
    }

    const token = await createJWT(userFound.id, userFound.name);

    res.json({ ok: true, uid: userFound.id, name: userFound.name, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "There was an error by signing in. Please contact the administrator"
    });
  }
};

const revalidateToken = async (req, res) => {
  const { uid, name } = req;

  const token = await createJWT(uid, name);

  res.json({ ok: true, token });
};

module.exports = { createUser, loginUser, revalidateToken };
