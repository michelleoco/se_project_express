const { celebrate } = require("celebrate");
const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validator");

const {
  createItem,
  getItems,
  likeItem,
  unlikeItem,
  deleteItem,
} = require("../controllers/clothingitems");

// Public routes
router.get("/", getItems); // Read

// Auth middleware
router.use(auth);

// Protected routes
router.post("/", celebrate(validateClothingItem), createItem); // Create
router.put("/:id/likes", celebrate(validateId), likeItem); // Update

router.delete("/:id/likes", celebrate(validateId), unlikeItem);
router.delete("/:id", celebrate(validateId), deleteItem);

module.exports = router;
