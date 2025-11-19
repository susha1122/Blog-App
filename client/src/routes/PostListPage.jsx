import { useState } from 'react'
import PostList from '../Components/PostList.jsx'
import SideMenu from '../Components/SideMenu'

const PostListPage = () => {

  const [open, setOpen] = useState(false);
  
  return (
    <div className="">
  <h1 className="mb-8 text-2xl">Development Blog</h1>

    <button
      onClick={() => setOpen(prev => !prev)}
      className="bg-blue-800 text-sm text-white px-4 py-2 rounded-2xl mb-4 md:hidden"
    >
      {open ? "Close" : "Filter or Search"}
    </button>

    <div className="flex flex-col-reverse md:flex-row gap-8">

      {/* POSTS — takes all available space */}
      <div className="flex-1">
        <PostList />
      </div>

      {/* SIDEMENU */}
      <div
        className={`${
          open ? "block" : "hidden"
        } md:block md:ml-auto md:pl-12`}
      >
        <div className="w-[260px]">
          <SideMenu />
        </div>
      </div>

    </div>
</div>

  )
}

export default PostListPage
