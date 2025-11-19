import React from 'react'
import Search from './Search'
import { Link, useSearchParams } from 'react-router-dom'

const SideMenu = () => {

  const [searchParams, setSearchParams] = useSearchParams()

  const currentSort = searchParams.get("sort") || "";
  

  const handleFilterChange = (e) =>{
    const newValue = e.target.value;

    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      sort: newValue,
    });
  };

  const handleCategoryChange = (category) =>{
    if (searchParams.get("cat") !== category)

    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      cat:category,
    });
  };

  return (
    <div className="px-4 h-max sticky top-8">

      <h1 className="mb-4 text-sm font-medium">Search</h1>
      <Search />

      <h1 className="mt-8 mb-4 text-sm font-medium">Filter</h1>
      <div className="flex flex-col gap-2 text-sm">

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="newest"
            checked={currentSort === "newest"}
            onChange={handleFilterChange}
            className="w-4 h-4 cursor-pointer"
          />
          Newest
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="most-popular"
            checked={currentSort === "most-popular"}
            onChange={handleFilterChange}
            className="w-4 h-4 cursor-pointer"
          />
          Most Popular
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="trending"
            checked={currentSort === "trending"}
            onChange={handleFilterChange}
            className="w-4 h-4 cursor-pointer"
          />
          Trending
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="oldest"
            checked={currentSort === "oldest"}
            onChange={handleFilterChange}
            className="w-4 h-4 cursor-pointer"
          />
          Oldest
        </label>

      </div>

      <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
      <div className="flex flex-col gap-2 text-sm">
        <span className=" cursor-pointer" onClick={()=>handleCategoryChange("general")}>All</span>
        <span className=" cursor-pointer" onClick={()=>handleCategoryChange("web-design")}>Web Design</span>
        <span className=" cursor-pointer" onClick={()=>handleCategoryChange("development")}>Development</span>
        <span className=" cursor-pointer" onClick={()=>handleCategoryChange("database")}>Databases</span>
        <span className=" cursor-pointer" onClick={()=>handleCategoryChange("seo")}>Search Engines</span>
        <span className=" cursor-pointer" onClick={()=>handleCategoryChange("marketing")}>Marketing</span>
      </div>

    </div>
  );
};

export default SideMenu;
