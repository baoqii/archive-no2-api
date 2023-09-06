const { body, validationResult } = require("express-validator");
const Tag = require("../models/tag");
const Post = require("../models/post");

// get all tags

exports.getAllTag = async (req, res, next) => {
  try {
    const tagsList = await Tag.find({}).sort({ tag: 1 }); // Sort ascending
    res.status(200).json({
      success: true,
      message: "Tags retrieved successfully",
      data: tagsList,
    });
  } catch (err) {
    console.error("Error fetching tags:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching tags",
      error: err.message,
    });
  }
};

exports.getPostsWithinATag = async (req, res, next) => {
  const options = {
    sort: { timestamp: -1 },
    populate: [
      { path: "author", select: "username" },
      { path: "comments" },
      { path: "tags" },
    ],
  };

  try {
    const postList = await Post.find(
      { tags: req.params.tag_id },
      null,
      options
    ).exec();

    if (!postList) {
      return res.status(404).json({ error: "No posts found with this tag" });
    }

    const tag = await Tag.findById(req.params.tag_id).exec();

    res.status(200).json({
      success: true,
      message: "Posts retrieved",
      data: {
        post_list: postList,
        tag,
      },
    });
  } catch (err) {
    next(err);
  }
};

// create tag

exports.createTag = [
  body("name", "Tag name required").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "An error occurred when creating tag",
        errors: errors.array(),
      });
    }

    try {
      let tag = await Tag.findOne({ name: req.body.name });
      if (tag) {
        throw new Error("Tag is already created");
      }

      tag = new Tag({ name: req.body.name });
      await tag.save();
      res.status(201).json({
        success: true,
        message: "Tag created!",
        data: {
          tag,
        },
      });
    } catch (err) {
      next(err);
    }
  },
];

// delete tag

exports.deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.tag_id);
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    await Tag.findByIdAndDelete(req.params.tag_id);

    res.status(200).json({
      success: true,
      message: "Tag deleted",
    });
  } catch (err) {
    next(err);
  }
};

// update tag

exports.updateTag = [
  body("name", "Tag name required").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "An error occurred when updating tag",
        errors: errors.array(),
      });
    }

    try {
      const tag = await Tag.findById(req.params.tag_id);
      if (!tag) {
        return res
          .status(404)
          .json({ success: false, message: "Tag not found" });
      }

      tag.name = req.body.name;
      await tag.save();

      res.status(200).json({
        success: true,
        message: "Tag updated!",
        data: {
          tag,
        },
      });
    } catch (err) {
      next(err);
    }
  },
];
