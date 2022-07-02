const express = require("express");
const app = express();
const router = require("./routes/booksapi");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 8000;

require("./db/db");

const staticPath = path.join(__dirname, "../public");

app.use(express.static(staticPath));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.send("hello");
// });

app.use("/", router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
