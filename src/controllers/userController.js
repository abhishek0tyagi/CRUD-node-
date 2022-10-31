const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {
  isValid,
  isValidName,
  isValidPhone,
  isValidReqBody,
} = require("../validator/validation");

//------------------------------------------------------------------------------------------------------------------------------------------------------

const registerUser = async function (req, res) {
  try {
    // data sent through request body
    let data = req.body;

    // if request body is empty
    if (!isValidReqBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: " Please enter user details" });
    }
    let name = data.name;
    let phone = data.phone;
    let address = data.address

    // VALIDATIONS:

    // name validation
    if (!isValidName(name)) {
      return res
        .status(400)
        .send({ status: false, msg: "plesae give a valid name" });
    }

    // if phone is empty
    if (isValid(phone) === false)
      return res.status(400).send({
        status: false,
        message: "Please enter the phone number(required field)",
      });
    // if phone is invalid
    if (isValidPhone(phone) === false)
      return res.status(400).send({
        status: false,
        message: `${phone} is not a valid phone number; Please provide a valid phone number`,
      });
    // phone duplication check
    let phoneCheck = await userModel.findOne({
      phone: phone,
    });
    if (phoneCheck)
      return res
        .status(400)
        .send({ status: false, message: "Phone number is already used!" });

    // registering user
    let registeredUser = await userModel.create(data);

    // response
    res.status(201).send({ status: true, message: registeredUser });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

let getBooks = async function (req, res) {
  try {
    //taking filter in query params
    let userQuery = req.query;

    //filtering the deleted data
    let filter = {
      isDeleted: false,
    };

    //checking if there is no filter in query params
    // if (!isValidReqBody(userQuery)) {
    //   return res.status(400).send({
    //     status: true,
    //     message: " Invalid parameters, please provide valid data",
    //   });
    // }

    //sending filter through query params
    const { userId, category, subcategory } = userQuery;

    //userId given by the user
    if (userId) {
      //checking for if userId if not valid
      if (!isValidObjectId(userId)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid userId" });
      }

      //if userId is valid
      if (isValid(userId)) {
        filter["userId"] = userId;
      }
    }

    //checking for if category is valid
    if (isValid(category)) {
      filter["category"] = category.trim();
    }

    //checking subcategory value for valid format (i.e.array of string in model)
    if (subcategory) {
      const subCategoryArray = subcategory
        .trim()
        .split(",")
        .map((s) => s.trim());
      filter["subcategory"] = { $all: subCategoryArray };
    }

    //finding books according to the query given by the user in query params
    let findBook = await bookModel.find(filter).select({
      title: 1,
      book_id: 1,
      excerpt: 1,
      userId: 1,
      category: 1,
      releasedAt: 1,
      reviews: 1,
    });

    //console.log(findBook);

    //checking is the findbook is an array and if its length is zero , means empty array
    if (Array.isArray(findBook) && findBook.length === 0) {
      return res
        .status(404)
        .send({ status: false, message: "Books Not Found" });
    }

    //Sorting of data of araay(findbook) by the title value
    const sortedBooks = findBook.sort((a, b) => a.title.localeCompare(b.title));

    //sending response of sortedBooks
    res
      .status(200)
      .send({ status: true, message: "Books list", data: sortedBooks });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
module.exports = { registerUser, getBooks };
