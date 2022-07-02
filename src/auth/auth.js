const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth_user = (req, res, next) => {
  try {
    console.log(req.cookies.booksapp);
    const token = req.cookies.booksapp;

    const user_authentication = jwt.verify(
      req.cookies.booksapp,
      process.env.TOKEN_SECRET_KEY
    );
    // console.log(user_authentication);
    // const user = await User.findOne({
    //   _id: user_authentication._id,
    //   email: user_authentication.email,
    // });

    if (user_authentication) {
      console.log("authentication success");
      next();
    } else {
      // res.status(400).send("Please log in again");
    }
  } catch (err) {
    res.status(400).send("authentication error");
    console.log("authentication error", err);
    // res.status(400).send("authentication error", err);
  }
};

module.exports = auth_user;
