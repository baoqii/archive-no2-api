const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const Comment = require("../models/comment");

// get all comments under a specific post

exports.getCommentsUnderPost = async (req, res, next) => {
  try {
    const commentsList = await Comment.find({ post: req.params.post_id });

    res.status(200).json({
      success: true,
      message: "Comments retrieved",
      data: {
        comment_list: commentsList,
      },
    });
  } catch (err) {
    next(err);
  }
};

// create a comment under a specific post

exports.createComment = [
  body("author", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("text", "Text must not be empty").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "An error occured when creating comment",
        errors: errors.array(),
      });
    }

    try {
      const post = await Post.findById(req.params.post_id);
      if (!post) {
        throw new Error("Post not found");
      }

      const comment = new Comment({
        post: req.params.post_id,
        text: req.body.text,
        author: req.body.author,
        timestamp: Date.now(),
      });

      await comment.save();
      post.comments.push(comment._id);
      await post.save();
      res.status(200).json({
        message: "Comment created",
        comment,
        post,
      });
    } catch (err) {
      next(err);
    }
  },
];

// get a specific comment under a specific post

exports.getSpecificComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.comment_id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment retrieved",
      data: {
        comment,
      },
    });
  } catch (err) {
    next(err);
  }
};

// delete a specific comment under a specific post

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.comment_id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    await Comment.findByIdAndDelete(comment._id);
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    res.status(200).json({
      success: true,
      message: "Comment deleted",
    });
  } catch (err) {
    next(err);
  }
};
