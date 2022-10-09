const { Router } = require("express");
const { check } = require("express-validator");
const { createUser, userLogin, token } = require("../controllers/auth");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJwt } = require("../middlewares/validate-jwt");

const router = Router();

//NOTE: Create new user
router.post(
  "/user",
  [
    check("name", "This field is mandatory").not().isEmpty(),
    check("email", "This field is mandatory").isEmail(),
    check("password", "This field is mandatory").isLength({
      min: 6,
    }),
    validateFields,
  ],
  createUser
);

//NOTE: User login
router.post(
  "/",
  [
    check("email", "This field is mandatory").isEmail(),
    check("password", "This field is mandatory").isLength({
      min: 6,
    }),
    validateFields,
  ],
  userLogin
);

//NOTE: Validate and revalidate token
router.get("/token", validateJwt, token);

module.exports = router;
