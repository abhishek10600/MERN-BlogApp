const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const User = require("./models/User");
const Post = require("./models/Post");

const uploadMiddleware = multer({ dest: "uploads/" });

const app = express();

const salt = bcrypt.genSaltSync(10);
const secretKey = "qijhdgyaibvsohfdgsaui";

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

//making connection with database
mongoose.connect(
  "mongodb+srv://blog:z4aUBnFGIGFMJ1gj@cluster0.jiqatnw.mongodb.net/?retryWrites=true&w=majority",
  () => {
    console.log("connection done");
  }
);

//Creating user (signup) functionality
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

//login functionality
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    //logged in
    jwt.sign({ username, id: userDoc._id }, secretKey, {}, (err, token) => {
      if (err) {
        throw err;
      }
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("Please log in with correct credentials");
  }
});


app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      throw err;
    }
    res.json(info);
  });
});

//logout functionality
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

//create Post functionality
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, async (err, info) => {
    if (err) {
      throw err;
    }
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      coverImg: newPath,
      author: info.id,
    });
    res.json({ postDoc });
  });
});

app.put("/post",uploadMiddleware.single('file'),async(req,res)=>{
  let newPath = null;
  if(req.file){
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  const {token} = req.cookies; 
  jwt.verify(token, secretKey, {}, async (err, info) => {
    if (err) {
      throw err;
    }
    const { id,title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if(!isAuthor){
      res.status(400).json("You are not the author");
    }
    await postDoc.update({
      title,
      summary,
      content,
      coverImg: newPath ? newPath : postDoc.coverImg,
    });
    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  const posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

//individual post functionality
app.get("/post/:id", async(req,res)=>{
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

const port = 4000;

app.listen(port, () => {
  console.log(`blog app listening at http://localhost:${port}`);
});
//mongodb+srv://blog:z4aUBnFGIGFMJ1gj@cluster0.jiqatnw.mongodb.net/?retryWrites=true&w=majority
