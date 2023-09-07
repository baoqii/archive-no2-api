const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const Tag = require("../models/tag");
const async = require("async");

// get all posts

exports.getPublishedPosts = async (req, res, next) => {
  const query = { isPublished: true };
  const options = {
    sort: { timestamp: -1 },
    populate: [
      { path: "author", select: "username" },
      { path: "comments" },
      { path: "tags" },
    ],
  };

  try {
    const postList = await Post.find(query, null, options).exec();
    if (!postList || postList.length === 0) {
      res.status(404).json({ success: false, message: "No posts found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Posts retrieved",
        data: {
          post_list: postList,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

// get a specific post

exports.getSpecificPost = async (req, res, next) => {
  const options = {
    sort: { timestamp: -1 },
    populate: [
      { path: "author", select: "username" },
      { path: "comments" },
      { path: "tags" },
    ],
  };

  try {
    const post = await Post.findById(req.params.post_id, null, options).exec();
    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Post retrieved",
        data: {
          post: post,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

// create a post

exports.createPost = [
  async (req, res, next) => {
    if (!Array.isArray(req.body.tag)) {
      req.body.tag = typeof req.body.tag === "undefined" ? [] : [req.body.tag];
    }
    next();
  },
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("content", "Content must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("tags.*").escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const results = await async.parallel({
        tags() {
          return Tag.find();
        },
      });

      for (const tag of results.tags) {
        if (req.body.tags.includes(tag._id)) {
          tag.checked = "true";
        }
      }
      return res.status(400).json({
        success: false,
        message: "An error occurred while creating post",
        data: {
          tags: results.tags,
        },
        errors: errors.array(),
      });
    }

    try {
      const post = new Post({
        author: req.user,
        title: req.body.title,
        content: req.body.content,
        timestamp: Date.now(),
        tags: req.body.tags || [],
        comments: [],
        isPublished: req.body.isPublished,
      });

      await post.save();

      res.status(201).json({
        success: true,
        message: "Post created successfully!",
        data: {
          post,
        },
      });
    } catch (err) {
      next(err);
    }
  },
];

// update a specific post

exports.updatePost = [
  async (req, res, next) => {
    req.body.tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags
      ? [req.body.tags]
      : [];

    req.body.comments = Array.isArray(req.body.comments)
      ? req.body.comments
      : req.body.comments
      ? [req.body.comments]
      : [];

    next();
  },

  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("content", "Text must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("tags.*").escape(),
  body("comments.*").escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const reqPost = new Post({
      _id: req.params.post_id,
      author: req.body.author,
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags ?? [],
      comments: req.body.comments ?? [],
      isPublished: req.body.isPublished,
    });

    if (!errors.isEmpty()) {
      const results = await new Promise((resolve, reject) => {
        async.parallel(
          {
            tags(callback) {
              Tag.find(callback);
            },
          },
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });

      for (const tag of results.tags) {
        if (reqPost.tags.includes(tag._id)) {
          tag.checked = "true";
        }
      }

      return res.status(400).json({
        success: false,
        message: "Failed to update post",
        data: {
          tags: results.tags,
          comments: results.comments,
          reqPost: reqPost, // Include reqPost for debugging
        },
        errors: errors.array(),
      });
    }

    try {
      const foundPost = await Post.findOne({ _id: req.params.post_id });

      if (!foundPost) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      foundPost.title = req.body.title;
      foundPost.content = req.body.content;
      foundPost.tags = req.body.tags;
      foundPost.comments = req.body.comments;
      foundPost.timestamp = foundPost.isPublished
        ? foundPost.timestamp
        : new Date();
      foundPost.isPublished = req.body.isPublished;

      const updatedPost = await foundPost.save();

      res.status(200).json({
        success: true,
        message: "Post updated successfully!",
        data: {
          post: updatedPost,
        },
      });
    } catch (err) {
      next(err);
    }
  },
];

// delete a specific post

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.post_id).exec();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await Post.findByIdAndDelete(post._id);
    res.status(200).json({
      success: true,
      message: "Post deleted!",
    });
  } catch (err) {
    next(err);
  }
};

// get unpublished posts (admin)

exports.getUnpublishedPosts = async (req, res, next) => {
  const query = { isPublished: false };
  const options = {
    sort: { timestamp: -1 },
    populate: [
      { path: "author", select: "username" },
      { path: "comments" },
      { path: "tags" },
    ],
  };

  try {
    const postList = await Post.find(query, null, options).exec();
    if (!postList || postList.length === 0) {
      res.status(404).json({ success: false, message: "No posts found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Unpublished posts retrieved",
        data: {
          post_list: postList,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};
