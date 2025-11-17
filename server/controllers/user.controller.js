// user.controller.js (full file)
import User from "../models/user.model.js";

export const getUserSavedPosts = async (req, res) => {
  try {
    const { userId: clerkUserId } = req.auth();

    if (!clerkUserId) {
      return res.status(401).json("Not Authenticated!");
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json("User not found");
    }

    // savedPosts is an array of strings
    return res.status(200).json(user.savedPosts);
  } catch (error) {
    console.error("getUserSavedPosts error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const savePost = async (req, res) => {
  try {
    const { userId: clerkUserId } = req.auth();
    const postId = req.body.postId;

    if (!clerkUserId) {
      return res.status(401).json("Not Authenticated!");
    }

    if (!postId) {
      return res.status(400).json("postId is required");
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Ensure comparison of strings
    const isSaved = user.savedPosts.some((p) => p.toString() === postId.toString());

    if (!isSaved) {
      await User.findByIdAndUpdate(user._id, {
        $push: { savedPosts: postId },
      });
    } else {
      await User.findByIdAndUpdate(user._id, {
        $pull: { savedPosts: postId },
      });
    }

    // Return the updated savedPosts array (fresh read)
    const updatedUser = await User.findById(user._id);

    return res.status(200).json({
      message: isSaved ? "Post unsaved" : "Post saved",
      savedPosts: updatedUser.savedPosts,
    });
  } catch (error) {
    console.error("savePost error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
