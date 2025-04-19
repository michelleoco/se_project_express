const router = require("express").Router();
const clothingItems = require("./clothingitems");
const userRouter = require("./users");
const auth = require("../middlewares/auth");
const { STATUS_CODES } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", auth, userRouter); // auth?
router.use("/items", auth, clothingItems); // auth?

// 404 handler
router.use((req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
