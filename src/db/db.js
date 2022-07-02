require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-shard-00-00.jxqzw.mongodb.net:27017,cluster0-shard-00-01.jxqzw.mongodb.net:27017,cluster0-shard-00-02.jxqzw.mongodb.net:27017/?ssl=true&replicaSet=atlas-a7ker7-shard-0&authSource=admin&retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connection successfull");
  })
  .catch((err) => console.log(err));
