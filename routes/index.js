const router = require("express").Router();
const clothingItems = require("./clothingitems");
const userRouter = require("./users");
const { STATUS_CODES } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", userRouter);
router.use("/items", clothingItems);

// 404 handler
router.use((req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
