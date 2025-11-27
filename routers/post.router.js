const express = require("express");
const { getPosts,createPost,deletePost, getPostById,updatePost } = require("../controllers/posts.controller");
const { identifier } = require("../middlewares/identification");

const router = express.Router();


// GET all posts
router.get("/posts", getPosts);

// GET single post by ID
router.get("/posts/:id", getPostById);

// POST create new post (protected route)
router.post("/posts", identifier, createPost);

// PATCH update post by ID (protected route)
router.patch("/posts/:id", identifier, updatePost);

// DELETE post by ID (protected route)
router.delete("/posts/:id", identifier, deletePost);

module.exports = router;
