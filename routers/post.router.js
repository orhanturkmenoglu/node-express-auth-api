const express = require("express");
const { getPosts,createPost,deletePost, getPostById } = require("../controllers/posts.controller");
const { identifier } = require("../middlewares/identification");

const router = express.Router();


router.get("/all-post",getPosts);
/* router.get("/single-post/:id",getPostById); */

router.post("/create-post",identifier,createPost);

router.delete("/delete-post/:id", identifier, deletePost);

module.exports = router;
