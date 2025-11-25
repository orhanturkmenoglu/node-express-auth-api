const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
      trim: true,
    },
    // userId ile kullanıcıyı ilişkilendiriyoruz
    /* mongoose.Schema.Types.ObjectId : MongoDB'deki benzersiz kimlik türüdür
        ref: "User" : Bu alanın User modeline referans olduğunu belirtir
    */
    userId: {
      type: mongoose.Schema.Types.ObjectId, //
      ref: "User",
      required: [true, "User ID is required!"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
