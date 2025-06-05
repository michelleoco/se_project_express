const { celebrate } = require("celebrate");
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
router.post("/signin", celebrate(validateAuthentication), login);
router.post("/signup", celebrate(validateUserInfo), createUser);

router.use("/users", userRouter);
router.use("/items", clothingItems);

// 404 handler
// router.use((req, res) => {
//   res.status(STATUS_CODES.NOT_FOUND).send({ message: "Router not found" });
// });

router.use((req, res, next) => next(new NotFoundError("Router not found")));

module.exports = router;
