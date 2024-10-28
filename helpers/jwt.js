const jwt = require("jsonwebtoken");

const generateJWT = (id, name) =>
  new Promise((res, rej) => {
    const payload = { id, name };

    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          rej("Cannot genereta token");
        }

        res(token);
      }
    );
  });

module.exports = { generateJWT };
