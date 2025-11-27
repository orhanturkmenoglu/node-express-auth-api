const { createPostSchema } = require("../middlewares/post.validator");
const Post = require("../models/post.model");

exports.getPosts = async (req, res) => {
  console.log("🔹 [getPosts] Handler triggered");
  const { page = 1 } = req.query; // Varsayılan sayfa 1
  const postsPerPage = 10;

  try {
    const pageNum = Math.max(0, page - 1); // Sayfa 1 veya daha düşükse 0

    console.log(
      `🔎 Fetching posts, page: ${page}, skip: ${pageNum * postsPerPage}`
    );

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(pageNum * postsPerPage)
      .limit(postsPerPage)
      .populate({
        path: "userId",
        select: "email",
      });

    console.log(`✅ Fetched ${posts.length} posts`);

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    console.error("🔥 Error in getPosts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.createPost = async (req, res) => {
  console.log("🔹 [createPost] Handler triggered");

  const { title, description } = req.body;
  const { userId } = req.user;

  try {
    // 1️⃣ Validate input
    console.log("🔍 Validating input with Joi schema...");
    const { error, value } = createPostSchema.validate({
      title,
      description,
      userId,
    });

    if (error) {
      console.log("❌ Validation failed:", error.details[0].message);
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    console.log("✅ Validation passed:", value);

    // 2️⃣ Create new post
    console.log("📝 Creating new post...");
    // 2️⃣ Create new post
    console.log("📝 Creating new post...");

    const newPost = await Post.create({
      title: value.title,
      description: value.description,
      userId: value.userId,
    });
    console.log("✅ Post created successfully:", newPost._id);
    // 3️⃣ Return response
    return res.status(201).json({
      success: true,
      message: "Post created successfully!",
      data: newPost,
    });
  } catch (err) {
    console.error("🔥 Error in createPost:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  console.log("🗑️ [deletePost] Handler triggered");
  console.log("🧪 req.params:", req.params);

  const { id } = req.params;
  const { userId } = req.user;

  try {
    // ID format kontrolü
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID format!",
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found!" });
    }

    if (post.userId.toString() !== userId) {
      console.log("⛔ Unauthorized delete attempt!", {
        postOwner: post.userId.toString(),
        requester: _userId,
      });
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post!",
      });
    }

    await Post.findByIdAndDelete(id);
    console.log("🗑️ Post deleted successfully:", id);
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully!",
    });
  } catch (error) {
    console.error("🔥 Error in deletePost:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getPostById = async (req, res) => {
  console.log("🔹 [getPostById] Handler triggered");
  console.log("🧪 req.params:", req.params);

  const { id } = req.params;

  // amaç gelen post id ye göre datayı dönme

  try {
    const post = await Post.findById(id);
    if (!post) {
      console.log("❌ Post not found:", id);
      return res
        .status(404)
        .json({ success: false, message: "Post not found!" });
    }
    console.log("✅ Post found:", post._id);

    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (error) {
    console.error("🔥 Error in getPostById:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
