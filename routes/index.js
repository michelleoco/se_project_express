const router = require("express").Router();
const clothingItems = require("./clothingitems");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItems);

router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

module.exports = router;
