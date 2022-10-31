const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");

const middleware = require("../middleware/auth");

//Api for creating user
router.post("/register", userController.registerUser);

//Api for getting books by query params
router.get("/user", middleware.authentication, userController.getBooks);

//Api for updating books by bookId in path params
router.put("/books/:bookId",middleware.authentication,middleware.authorisation,bookController.updateBook);

//Api for deleting books by bookId in path params
router.delete("/books/:bookId",middleware.authentication,middleware.authorisation,bookController.deleteBook);

//Api for updating review  by bookId and review id in path params
router.put("/books/:bookId/review/:reviewId", reviewController.reviewUpdate);

//Api for deleting review  by bookId and review id in path params
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview);


// if api is invalid OR wrong URL
router.all("/*", function (req, res) {
  res
    .status(404)
    .send({ status: false, msg: "The api you requested is not available" });
});

module.exports = router;
