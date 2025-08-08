const router = require("express").Router();
const clothingItems = require("./clothingitems");
const userRouter = require("./users");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { login, createUser } = require("../controllers/users");
const {
  validateUserInfo,
  validateAuthentication,
} = require("../middlewares/validator");

// Public routes
router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserInfo, createUser);

router.use("/users", userRouter);
router.use("/items", clothingItems);

router.use((req, res, next) => next(new NotFoundError("Router not found")));

module.exports = router;
