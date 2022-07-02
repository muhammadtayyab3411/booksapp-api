require("dotenv").config();
const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Book = require("../models/Book");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth_user = require("../auth/auth");

// for storing files in server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/bookImages"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// router testing
router.get("/test", (req, res) => res.send("Router testing"));
// const auth_user = require("../auth/auth");

// fecthing all books
router.get("/getBooks", auth_user, async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
    console.log("books sent");
  } catch (err) {
    res.status(404).send(err);
    console.log(err);
  }
});

// fecthing a single book by id
router.get("/getbook/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const book = await Book.findById(_id);
    res.status(200).send(book);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
});

// adding a book
router.post("/addBook", upload.single("book_image"), async (req, res) => {
  // upload.single("book_image");
  const bookDetails = {
    title: req.body.title,
    book_image: req.file.filename,
    isbn: req.body.isbn,
    author: req.body.author,
    published_date: req.body.published_date,
    publisher: req.body.publisher,
    updated_date: req.body.updated_date,
  };

  try {
    const book = new Book(bookDetails);
    const bookSaved = await book.save();
    res.status(201).send(bookSaved);
    console.log(bookSaved);
    console.log(bookDetails.title, bookDetails.book_image, req.file);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
});

// update a single book
router.put("/updatebook/:id", async (req, res) => {
  try {
    const updatebook = await Book.findByIdAndUpdate(req.params.id, req.body);
    res.status(201).send(updatebook);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
});

// delete a book
router.delete("/deletebook/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndRemove(req.params.id);
    res.status(201).send(deletedBook);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
});
// Sign up POST Request
router.post("/signup", async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
    });

    if (user.password === user.confirm_password) {
      await user.save();
      console.log(user);
      res.status(201).send(user);
    } else {
      console.log("Password is not matching");
      res.status(400).send("Password is not matching");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// Login POST Request
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    // console.log(user);
    if (user !== null) {
      const verify_password = await bcrypt.compare(password, user.password);
      if (verify_password) {
        const token = jwt.sign(
          { email: user.email, _id: user._id },
          process.env.TOKEN_SECRET_KEY
        );
        // console.log(token);
        // store jwt token in cookies on login
        res.cookie("booksapp", token + "", {
          expires: new Date(Date.now() + 5000000000),
          httpOnly: true,
          secure: false,
        });
        res.status(200).send(`${user.name} Login Successfull`);
        console.log(res.statusCode, "in success");
      } else {
        res.status(400).send("error while login");
        // console.log(res.statusCode, "wrong password");
      }
    } else {
      res.status(400).send("Invalid User");
      console.log("no user found");
    }
  } catch (err) {
    // res.status(400).send(err);
    console.log(err, "in catch");
  }
});

// Is authenticated
router.get("/isAuthenticated", async (req, res) => {
  try {
    const isAuthenticated = jwt.verify(
      req.cookies.booksapp,
      process.env.TOKEN_SECRET_KEY
    );
    // console.log(isAuthenticated);
    if (isAuthenticated) {
      const user = await User.find({ _id: isAuthenticated._id });
      res.status(200).send(user);
      console.log(user[0].name);
    }
  } catch (err) {
    res.status(400).send(err);
    console.log(err.message);
  }
});

// Logout user
router.get("/logout", async (req, res) => {
  try {
    res.clearCookie("booksapp");
    res.status(201).send("logout success");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
