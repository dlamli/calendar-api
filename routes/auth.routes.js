const { Router } = require("express");
const { check } = require("express-validator");

const {
  authCreateUser,
  authLogin,
  authRevalidateToken,
} = require("../controllers/auth.controller");

const { validateField } = require("../middlewares/field-validator");
const { validateJWT } = require("../middlewares/jwt-validator");

const router = Router();

//GET
router.get("/renew", validateJWT, authRevalidateToken);

//POST
router.post(
  "/",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Email is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    validateField,
  ],
  authLogin
);

//POST
router.post(
  "/new",
  [
    check("name", "Name is required").not().isEmpty(),
    check("password", "Name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    validateField,
  ],
  authCreateUser
);

module.exports = router;
