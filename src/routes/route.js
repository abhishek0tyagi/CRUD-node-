const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");

const middleware = require("../middleware/auth");

//Api for creating user
router.post("/register", userController.registerUser);

//Api for getting user by query params
router.get("/user",  userController.getUsers);

//Api for updating user by name in path params
router.put("/user/:name",   userController.updateUser);

//Api for deleting phone by phone in path params
router.delete("/user/:phone",  userController.deleteUser);


// if api is invalid OR wrong URL
router.all("/*", function (req, res) {
  res
    .status(404)
    .send({ status: false, msg: "The api you requested is not available" });
});

module.exports = router;
