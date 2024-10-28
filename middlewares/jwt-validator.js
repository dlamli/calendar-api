const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const validateJWT = (req = request, res = response, next) => {
  const xToken = req.header("x-token");

  if (!xToken) {
    return res.status(401).json({
      ok: false,
      msg: "No token provided.",
    });
  }

  try {
    // {
    //   id: '671f078504d97bd686e53d22',
    //   name: 'John Doe',
    //   iat: 1730089810,
    //   exp: 1730097010
    // }
    const { id, name } = jwt.verify(xToken, process.env.SECRETORPRIVATEKEY);

    req.id = id;
    req.name = name;

  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Invalid token.",
    });
  }

  next();
};

module.exports = {
  validateJWT,
};
