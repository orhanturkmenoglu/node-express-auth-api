const Post = require("../models/post.model");

exports.getPosts = async (req, res) => {
  console.log("🔹 [getPosts] Handler triggered");
  const { page = 1 } = req.query; // Varsayılan sayfa 1
  const postsPerPage = 10;

  try {
    const pageNum = Math.max(0, page - 1); // Sayfa 1 veya daha düşükse 0

    console.log(`🔎 Fetching posts, page: ${page}, skip: ${pageNum * postsPerPage}`);

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
