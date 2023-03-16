/* eslint-disable no-useless-catch */
require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const {
  PasswordTooShortError,
  UserTakenError,
  UnauthorizedError,
} = require("../errors");

const {
  createUser,
  getUserByUsername,
  getUser,
  getUserById,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
} = require("../db");

// POST /api/users/register
//still in progress
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (password.length < 8) {
     return next({
        name: "PasswordTooShortError",
        message: PasswordTooShortError(),
      });
    }
    //check if user already exists
    const _user = await getUserByUsername(username);
    if (_user) {
     return next({
        name: "UserTakenError",
        message: UserTakenError(username),
      });
    }
    const user = await createUser({ ...req.body });
    const token = jwt.sign(
      {
        username,
        password,
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res.send({
      message: "thank you for signing up",
      token,
      user,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/users/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await getUser({ username, password });

    if (!user) {
      return next({ name: "Bad Login", message: "Username or Password is incorrect" });
    }

    const token = jwt.sign(
      {
        username,
        password,
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res.send({
      message: "Welcome Back",
      token,
      user,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// GET /api/users/me
router.get("/me", async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    return next({ name: "UnauthorizedUserError", message: UnauthorizedError() });
  }
  try {
    res.send(req.user);
  } catch ({ name, message }) {
    next(name, message);
  }
});
// GET /api/users/:username/routines
router.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;
  try {
    let result;
    if (username) {
      if (req.user.username === username) {
        result = await getAllRoutinesByUser(req.user);
      } else {
        result = await getPublicRoutinesByUser({ username });
      }
    }
    if (!result) {
      return next({
        name: "GetUserRoutinesError",
        message: "Could not get routines for user",
      });
    }
    res.send(result);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = router;
