import { Link } from "react-router-dom";
import Image from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";

const fetchPost = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=newest`
  );
  return res.data;
};

// -------------------------------------------
// Skeleton Loader Component
// -------------------------------------------
const Skeleton = ({ big }) => {
  return (
    <div
      className={`animate-pulse flex flex-col gap-4 ${
        big ? "w-full lg:w-1/2" : "w-full"
      }`}
    >
      {/* Image skeleton */}
      <div
        className={`bg-gray-300 rounded-3xl w-full ${
          big ? "h-64 md:h-80 lg:h-96" : "h-28"
        }`}
      ></div>

      {/* Text skeleton */}
      <div className="flex gap-4 items-center mt-2">
        <div className="h-4 w-10 bg-gray-300 rounded"></div>
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
        <div className="h-4 w-16 bg-gray-300 rounded"></div>
      </div>

      <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
      <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
    </div>
  );
};

const FeaturedPost = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: fetchPost,
  });

  const posts = data?.posts || [];

  // -------------------------------------------
  // Show skeleton while loading
  // -------------------------------------------
  if (isPending) {
    return (
      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <Skeleton big />
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    );
  }

  if (error) return "Something went wrong: " + error.message;
  if (posts.length === 0) return null;

  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-8">
      {/* -------------------------------------------
          BIG FIRST FEATURED POST
      ------------------------------------------- */}
      {posts[0] && (
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {posts[0].img && (
            <Image
              src={posts[0].img}
              className="rounded-3xl object-cover w-full"
              w={900}
              alt={posts[0].title}
            />
          )}

          <div className="flex items-center gap-4">
            <h1 className="font-semibold lg:text-lg">01.</h1>
            <Link className="text-blue-800 lg:text-lg">{posts[0].category}</Link>
            <span className="text-gray-500">{format(posts[0].createdAt)}</span>
          </div>

          <Link
            to={posts[0].slug}
            className="text-xl lg:text-3xl font-semibold lg:font-bold"
          >
            {posts[0].title}
          </Link>
        </div>
      )}

      {/* -------------------------------------------
          RIGHT SIDE — 3 SMALLER POSTS
      ------------------------------------------- */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        {posts.slice(1, 4).map((post, index) => (
          <div key={post._id} className="flex gap-4">
            <div className="w-1/3 aspect-video">
              {post.img && (
                <Image
                  src={post.img}
                  className="rounded-3xl object-cover w-full h-full"
                  w={300}
                  alt={post.title}
                />
              )}
            </div>

            <div className="w-2/3">
              <div className="flex items-center gap-4 text-sm lg:text-base mb-3">
                <h1 className="font-semibold">
                  {String(index + 2).padStart(2, "0")}.
                </h1>
                <Link className="text-blue-800">{post.category}</Link>
                <span className="text-gray-500">{format(post.createdAt)}</span>
              </div>

              <Link
                to={post.slug}
                className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl font-medium"
              >
                {post.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPost;
