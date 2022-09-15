/*
User routes
host + /api/auth
*/

const express = require("express");
const { check } = require("express-validator");

const { Router } = require("express");
const {
  createUser,
  loginUser,
  revalidateToken
} = require("../controllers/auth");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();

router.post(
  "/new",
  [
    check("name", "The name is a must").not().isEmpty(),
    check("email", "The email is a must").isEmail(),
    check(
      "password",
      "The password should have 6 characters at least"
    ).isLength({
      min: 6
    }),
    validateFields
  ],
  createUser
);

router.post(
  "/",
  [
    check("email", "The email is a must").isEmail(),
    check(
      "password",
      "The password should have 6 characters at least"
    ).isLength({
      min: 6
    }),
    validateFields
  ],
  loginUser
);

router.get("/renew", validateJWT, revalidateToken);

module.exports = router;
