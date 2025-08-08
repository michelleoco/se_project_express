const ClothingItem = require("../models/clothingitems");
const { STATUS_CODES } = require("../utils/statuscodes");
const { BadRequestError } = require("../utils/errors/BadRequestError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { ForbiddenError } = require("../utils/errors/ForbiddenError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((items) => res.status(STATUS_CODES.CREATED).send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
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

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else {
        next(err);
      }
    });
};

const unlikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  // Add next parameter
  ClothingItem.findById(req.params.id)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new ForbiddenError("Forbidden");
      }
      return ClothingItem.findByIdAndDelete(req.params.id);
    })
    .then((deletedItem) => res.send({ deletedItem }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else if (err instanceof ForbiddenError) {
        next(err);
      } else {
        next(err);
      }
    });
};

module.exports = { createItem, getItems, likeItem, unlikeItem, deleteItem };
