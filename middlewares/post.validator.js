const Joi = require("joi");

exports.createPostSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .trim()
    .messages({
      "string.base": "Title must be a string",
      "string.empty": "Title cannot be empty",
      "string.min": "Title must be at least 3 characters",
      "string.max": "Title cannot exceed 100 characters",
      "any.required": "Title is required",
    }),

  description: Joi.string()
    .min(5)
    .max(500)
    .required()
    .trim()
    .messages({
      "string.base": "Description must be a string",
      "string.empty": "Description cannot be empty",
      "string.min": "Description must be at least 5 characters",
      "string.max": "Description cannot exceed 500 characters",
      "any.required": "Description is required",
    }),

  userId: Joi.string()
    .required()
    .messages({
      "string.base": "User ID must be a string",
      "string.empty": "User ID cannot be empty",
      "any.required": "User ID is required",
    }),
});

exports.updatePostSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .trim()
    .messages({
      "string.base": "Title must be a string",
      "string.empty": "Title cannot be empty",
      "string.min": "Title must be at least 3 characters",
      "string.max": "Title cannot exceed 100 characters",
    }),

  description: Joi.string()
    .min(5)
    .max(500)
    .trim()
    .messages({
      "string.base": "Description must be a string",
      "string.empty": "Description cannot be empty",
      "string.min": "Description must be at least 5 characters",
      "string.max": "Description cannot exceed 500 characters",
    }),
}).min(1).messages({
  "object.min": "At least one field (title or description) must be provided for update",
});
