const express = require("express");
const router = express.Router();
const passport = require("passport");
const tagController = require("../controllers/tagController");

// get all tags
router.get("/", tagController.getAllTag);

// create a tag
router.post(
  "/new-tag",
  passport.authenticate("jwt", { session: false }),
  tagController.createTag
);

// delete a tag
router.delete(
  "/:tag_id",
  passport.authenticate("jwt", { session: false }),
  tagController.deleteTag
);

// update a tag
router.put(
  "/:tag_id",
  passport.authenticate("jwt", { session: false }),
  tagController.updateTag
);

module.exports = router;
