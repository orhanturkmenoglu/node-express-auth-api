const express = require("express");
const { getPosts,createPost } = require("../controllers/posts.controller");
const { identifier } = require("../middlewares/identification");

const router = express.Router();


router.get("/all-post",getPosts);
/* router.get("/single-post"); */
router.post("/create-post",identifier,createPost);

/* 
router.put("/update-post");


router.delete("/delete-post");
 */
module.exports = router;
