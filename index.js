const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const post = 3000;
const uri =
  "mongodb+srv://fverfdesfc:21189590@cluster0.qoq969i.mongodb.net/?retryWrites=true&w=majority";
dotenv.config();

//middleware
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//連結資料庫
mongoose
  .connect(uri)
  .then(() => {
    console.log("資料庫連接成功");
  })
  .catch((e) => {
    console.log("資料庫連接失敗");
    console.log(e);
  });

//request router
app.get("/", (req, res) => {
  res.send("首頁");
});

app.listen(post, () => {
  console.log("run server");
});
