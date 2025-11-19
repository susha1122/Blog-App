// post.controller.js (full file)
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;

    const query = {}

    const cat = req.query.cat;
    const author = req.query.author;
    const searchQuery = req.query.search;
    const sortQuery = req.query.sort;
    const featured = req.query.featured;    

    if(cat){
      query.category = cat;
    }

    if(searchQuery){
      query.title = {$regex: searchQuery, $options: "i"};
    }

    if(author){
      const user = await User.findOne({ username:author}).select("_id");

      if(!user){
        return res.status(404).json("No post found!")
      }

      query.user = user._id; 
    }

    let sortObj = {createdAt: -1}

    if(sortQuery) {
      switch (sortQuery) {
        case "newest":
          sortObj = {createdAt: -1}
          break;
        case "oldest":
          sortObj = {createdAt: 1}
          break;
        case "popular":
          sortObj = {visit: -1}
          break;
        case "trending":
          sortObj = {visit: -1}
          query.createdAt = {
            $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          }
          break;
      
        default:
          break;
      }
    }

    if (featured) {
      query.isFeatured = true;
    }

    const posts = await Post.find(query)
    .populate("user", "username")
    .sort(sortObj)
    .limit(limit)
    .skip((page - 1) * limit);

    const totalPosts = await Post.countDocuments();
    const hasMore = page * limit < totalPosts;
    res.status(200).json({ posts, hasMore });
  } catch (error) {
    console.error("getPosts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate("user", "username img");
    if (!post) {
      return res.status(404).json("Post not found");
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("getPost error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { userId: clerkUserId } = req.auth();
    if (!clerkUserId) {
      return res.status(401).json("Unauthorized");
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json("User not found");
    }

    let slug = req.body.title.replace(/ /g, "-").toLowerCase();

    let existingPost = await Post.findOne({ slug });
    let counter = 2;

    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await Post.findOne({ slug });
      counter++;
    }

    const newPost = new Post({ user: user._id, slug, img: req.body.img || "", ...req.body });

    const post = await newPost.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("createPost error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { userId: clerkUserId } = req.auth();
    if (!clerkUserId) {
      return res.status(401).json("Unauthorized");
    }

    const role = req.auth().sessionClaims?.metadata?.role || "user";

    if (role === "admin") {
      // admin can delete any post by id
      await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json("Post has been deleted");
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Only delete if post belongs to user
    const deletedPost = await Post.findOneAndDelete({ _id: req.params.id, user: user._id });

    if (!deletedPost) {
      return res.status(403).json("You can delete only your posts");
    }

    res.status(200).json("Post deleted successfully");
  } catch (error) {
    console.error("deletePost error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const featurePost = async (req, res) => {

    const { userId: clerkUserId } = req.auth();
    const {postId: postId} = req.body
    if (!clerkUserId) {
      return res.status(401).json("Unauthorized");
    }

    const role = req.auth().sessionClaims?.metadata?.role || "user";

    if (role !== "admin") {
      // admin can delete any post by id
      return res.status(200).json("You cannot feature Posts");
    }

    const post = await Post.findById(postId)

    if(!post){
      return res.status(404).json("Post not found")
    }
    const isFeatured = post.isFeatured

    const updatedPost = await Post.findByIdAndUpdate(postId, {
      isFeatured: !isFeatured,
    },{ new: true })

    res.status(200).json(updatedPost);
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});

export const uploadAuth = async (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
  } catch (error) {
    console.error("uploadAuth error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

