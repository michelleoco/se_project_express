const User = require("../models/users");
const { STATUS_CODES } = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

// POST
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  console.log("1. Starting user creation with:", { name, email }); // Add this

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
      // console.log("ERROR", err.name); // Checks what the error is called
      console.log("Error details:", {
        errorName: err.name,
        errorMessage: err.message,
        errorCode: err.code,
      });
      if (err.name === "ValidationError") {
        const invalidFields = Object.keys(err.errors).join(", ");
        return res.status(STATUS_CODES.BAD_REQUEST).send({
          message: `Invalid data - The following fields are required: ${invalidFields}`,
        });
      }
      if (err.code === 11000) {
        return res.status(STATUS_CODES.CONFLICT_ERROR).send({
          message:
            "An account with this email already exists- please use a different email",
        });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

// GET
const getCurrentUser = (req, res) => {
  const { _id } = req.user; // Dot said replace userId with _id
  User.findById(_id) // Dot said replace userId with _id
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid user ID" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: "Incorrect email or password" });
    });
};

const updateProfile = (req, res) => {
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
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        const invalidFields = Object.keys(err.errors).join(", ");
        return res.status(STATUS_CODES.BAD_REQUEST).send({
          message: `Invalid data - The following fields are required: ${invalidFields}`,
        });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
