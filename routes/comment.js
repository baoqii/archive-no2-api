const express = require("express");
const router = express.Router();
const passport = require("passport");
const commentController = require("../controllers/commentController");

// get all comments under a specific post
router.get("/:post_id/comments", commentController.getCommentsUnderPost);

// create a comment under a specific post
router.post("/:post_id/new-comment", commentController.createComment);

// get a specific comment under a specific post
router.get("/:post_id/:comment_id", commentController.getSpecificComment);

// delete a specific comment under a specific post
router.delete(
  "/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  commentController.deleteComment
);

module.exports = router;
