const ClothingItem = require("../models/clothingitems");
const { STATUS_CODES } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  // console.log("object", name, weather, imageUrl);
  ClothingItem.create({ name, weather, imageUrl })
    .then((items) => res.status(STATUS_CODES.CREATED).send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: err.message });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(STATUS_CODES.OK).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: err.message }); // General "catch all" catch block
    });
};

const likeItem = (req, res) => {
  // console.log("check", req.user._id);
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.status(STATUS_CODES.OK).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(STATUS_CODES.OK).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.id)
    .orFail()
    .then((item) => res.status(STATUS_CODES.OK).send({}))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = { createItem, getItems, likeItem, unlikeItem, deleteItem };
