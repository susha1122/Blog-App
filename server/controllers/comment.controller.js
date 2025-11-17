// comment.controller.js (full file)
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

export const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username img")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error("getPostComments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { userId: clerkUserId } = req.auth();
    const postId = req.params.postId;

    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json("User not found");
    }

    const newComment = new Comment({
      ...req.body,
      user: user._id,
      post: postId,
    });

    const savedComment = await newComment.save();

    // slight delay kept intentionally if you rely on it client-side
    setTimeout(() => {
      res.status(201).json(savedComment);
    }, 3000);
  } catch (error) {
    console.error("addComment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { userId: clerkUserId } = req.auth();
    const id = req.params.id;

    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const role = req.auth().sessionClaims?.metadata?.role || "user";

    if (role === "admin") {
      await Comment.findByIdAndDelete(id);
      return res.status(200).json("Comment has been deleted");
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json("User not found");
    }

    const deletedComment = await Comment.findOneAndDelete({ _id: id, user: user._id });

    if (!deletedComment) {
      return res.status(403).json("You can only delete your comments");
    }

    res.status(200).json("Comment deleted");
  } catch (error) {
    console.error("deleteComment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
