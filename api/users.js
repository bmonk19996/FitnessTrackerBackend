/* eslint-disable no-useless-catch */
require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { PasswordTooShortError, UserTakenError, UnauthorizedError} = require("../errors");

const {
  createUser,
  getUserByUsername,
  getUser,
  getUserById,
  getAllRoutinesByUser,
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
    const token = jwt.sign(
      {
        username,
        password
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res.send({
      message: "thank you for signing up",
      token,
      user
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/users/login
router.post("/login", async (req, res, next) => {
  try{
  const {username, password} = req.body;
  

  const user = await getUser({username, password});

  if(!user)
  {
    next({name:"Bad Login", message:"Username or Password is incorrect"})
  }

  const token = jwt.sign(
    {
      username,
      password,
      id:user.id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1w",
    }
  );
  res.send({
    message: "Welcome Back",
    token,
    user
  });
}
catch({name, message})
{
  next({name, message})
}
});
// GET /api/users/me
router.get("/me", async (req, res) => {
  if(!req.user)
  {
    next({name:"UnauthorizedUserError", message:UnauthorizedError})
  }
  try{
  res.send(req.user.username);
  }
  catch({name, message})
  {
    next(name, message)
  }
});
// GET /api/users/:username/routines
router.get("/:username/routines", async (req, res, next) => {
  const {username} = req.params;
  try
  {
    if(username)
    {
      const result = await getAllRoutinesByUser({username});
      console.log("result", result)
      if(result)
      {
        res.send(result);
      }
      else
      {
        next({name:"GetUserRoutinesError", message:"Could not get routines for user"})
      }
    }
  }
  catch({name, message})
  {
    next({name, message})
  }
});
module.exports = router;
