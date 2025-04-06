const router = require("express").Router();

const {
  createItem,
  getItems,
  likeItem,
  unlikeItem,
  deleteItem,
} = require("../controllers/clothingitems");

//CRUD

//Create

router.post("/", createItem);

//Read

router.get("/", getItems);

//Update

router.put("/:id/likes", likeItem);

//Delete

router.delete("/:id/likes", unlikeItem);
router.delete("/:id", deleteItem);

module.exports = router;
