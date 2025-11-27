const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required!"],
      trim: true,
      unique: [true, "Email must be unique!"],
      minLength: [5, "Email must be at least 5 characters long!"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minLength: [6, "Password must be at least 6 characters long!"],
      trim: true,
      select: false, // select false yaparak şifreyi sorgularda gizliyoruz
    },
    verified: {
      type: Boolean,
      default: false,
    },

    role : {
      type: String,
      enum : ["USER","ADMIN"],
      default:"USER",
      required: [true,"Role is required !"]
    },

    verificationCode :{
        type: String,
        select: false,
    },
    verificationCodeValidation :{
        type: Number,
        select: false,
    },
    forgotPasswordCode :{ 
        type: String,
        select: false,
    },
    forgotPasswordCodeValidation :{ 
        type: Number,
        select: false,
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);

