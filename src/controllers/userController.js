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

let getUsers = async function (req, res) {
  try {
    //taking filter in query params
    let userQuery = req.query;

    //sending filter through query params
    const { name} = userQuery;


    //finding books according to the query given by the user in query params
    let findBook = await bookModel.find({name:name}).select({
      address: 1,
      phone:1
    });


    //Sorting of data of araay(findbook) by the title value
    const sorteduser = findBook.sort((a, b) => a.name.localeCompare(b.name));

    //sending response of sortedBooks
    res
      .status(200)
      .send({ status: true, message: "user list", data: sortedUsers });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
module.exports = { registerUser, getUsers };
