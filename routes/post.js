const express = require("express");
const router = express.Router();
const passport = require("passport");
const postController = require("../controllers/postController");

// get all posts
router.get("/all", postController.getPublishedPosts);

// get unpublished posts (admin)
router.get(
  "/unpublished",
  passport.authenticate("jwt", { session: false }),
  postController.getUnpublishedPosts
);

// get a specific post
router.get("/:post_id", postController.getSpecificPost);

// create a post
router.post(
  "/new-post",
  passport.authenticate("jwt", { session: false }),
  postController.createPost
);

// update a specific post
router.put(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  postController.updatePost
);

// delete a specific post
router.delete(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  postController.deletePost
);

module.exports = router;
