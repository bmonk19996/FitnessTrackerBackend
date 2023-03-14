/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const {PasswordTooShortError, UserTakenError} = require('../errors')

// POST /api/users/register
    usersRouter.post("/register", async (req, res, next) => {
    const { username, password } = req.body;
    try {
        if(password.length < 8){
            next({
                name:'PasswordTooShortError',
                message: PasswordTooShortError()
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
        name,
        location,
      });
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      res.send({
        message: "thank you for signing up",
        token,
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = usersRouter;
