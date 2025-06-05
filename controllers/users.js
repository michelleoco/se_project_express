const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");
const { STATUS_CODES } = require("../utils/statuscodes");
const { BadRequestError } = require("../utils/errors/BadRequestError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { ConflictError } = require("../utils/errors/ConflictError");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");

// POST
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(STATUS_CODES.CREATED).send(userObject);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        const invalidFields = Object.keys(err.errors).join(", ");
        next(
          new BadRequestError(
            `Invalid data - The following fields are required: ${invalidFields}`
          )
        );
      } else if (err.code === 11000) {
        next(
          new ConflictError(
            "An account with this email already exists- please use a different email"
          )
        );
      } else {
        next(err);
      }
    });
};

// GET
const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new BadRequestError("The password and email fields are required")
    );
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )

    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(STATUS_CODES.OK).send(userObject);
    })

    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else if (err.name === "ValidationError") {
        const invalidFields = Object.keys(err.errors).join(", ");
        next(
          new BadRequestError(
            `Invalid data - The following fields are required: ${invalidFields}`
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
