const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

const authCreateUser = async (req = request, res = response) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user)
      return res.status(400).json({
        ok: false,
        msg: "User already exists",
      });

    user = new User({ name, email, password });

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // DB Saving
    await user.save();

    return res.status(201).json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Contact with the administrator.",
    });
  }
};

const authLogin = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    //Email incorrect
    if (!user)
      return res.status(400).json({
        ok: false,
        msg: "User/Password incorrect",
      });

    // Match password
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword)
      return res.status(400).json({
        ok: false,
        msg: "User or Password incorrect",
      });

    //Generate JWT
    const token = await generateJWT(user.id, user.name);

    return res.status(200).json({
      ok: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Contact with the administrator.",
    });
  }
};

const authRevalidateToken = async (req = request, res = response) => {
  const id = req.id;
  const name = req.name;

  try {
    const token = await generateJWT(id, name);

    return res.status(200).json({
      ok: true,
      user: {
        id,
        name,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Contact with the administrator.",
    });
  }
};

module.exports = {
  authCreateUser,
  authLogin,
  authRevalidateToken,
};
