//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

// const postData = [];

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
});

const blogsSchema = {
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
};

const Blog = mongoose.model("Blog", blogsSchema);

const blog = new Blog({
  title: "Welcome to the blog",
  description: "This is sample initial data of the blog.",
});

app.get("/", function (req, res) {
  Blog.find({}, function (err, blogData) {
    if (!err) {
      res.render("home", {
        content: homeStartingContent,
        postData: blogData,
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    content: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    content: contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:postId", (req, res) => {
  const postId = req.params.postId;

  Blog.findOne({ _id: postId }, function (err, data) {
    if (err) {
      res.redirect("/");
    } else {
      res.render("post", {
        postTitle: data.title,
        postDescr: data.description,
      });
    }
  });

  // postData.forEach((post) => {
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle === requestTitle) {
  //     console.log("match found");
  //     res.render("post", {
  //       postTitle: post.title,
  //       postDescr: post.description,
  //     });
  //   } else {
  //     console.log("not a match");
  //   }
  // });
});

app.post("/compose", function (req, res) {
  const blog = new Blog({
    title: req.body.postTitle,
    description: req.body.postDescr,
  });

  blog.save();

  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
