const express = require("express");
const { getPosts,createPost,deletePost, getPostById,updatePost } = require("../controllers/posts.controller");
const { identifier } = require("../middlewares/identification");

const router = express.Router();


// GET all posts
router.get("/all", getPosts);                // Tüm gönderileri getir

// GET single post by ID
router.get("/view/:id", getPostById);        // Belirli gönderiyi getir

// POST create new post (protected)
router.post("/create", identifier, createPost);  // Yeni gönderi oluştur

// PATCH update post by ID (protected)
router.patch("/update/:id", identifier, updatePost);  // Gönderiyi güncelle

// DELETE post by ID (protected)
router.delete("/delete/:id", identifier, deletePost); // Gönderiyi sil

module.exports = router;
