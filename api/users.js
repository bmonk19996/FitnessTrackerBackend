/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { PasswordTooShortError, UserTakenError } = require("../errors");

const {
  createUser,
  getUserByUsername,
  getUser,
  getUserById,
} = require("../db");

// POST /api/users/register
//still in progress
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (password.length < 8) {
      next({
        name: "PasswordTooShortError",
        message: PasswordTooShortError(),
      });
    }
    //check if user already exists
    const _user = await getUserByUsername(username);
    if (_user) {
      next({
        name: "UserTakenError",
        message: UserTakenError(username),
      });
    }
    const user = await createUser({
      username,
      password,
    });
    // console.log(process.env.JWT_SECRET)
    // const token = jwt.sign(
    //   {
    //     username,
    //     password
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "1w",
    //   }
    // );
    // console.log(token)
    res.send({
      message: "thank you for signing up",
    });
  } catch (e) {
    console.error('hello',e)
  }
});
// POST /api/users/login
router.post("/login", async (req, res) => {});
// GET /api/users/me
router.get("/me", async (req, res) => {});
// GET /api/users/:username/routines
router.get("/:username/routines", async (req, res) => {});
module.exports = router;
