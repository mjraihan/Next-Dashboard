"use client";

export default function SidebarFilter({
  search,
  setSearch,
  categories,
  showAllCategories,
  setShowAllCategories,
  isMobile = false,
  showSidebar,
  setShowSidebar,
}) {
  return isMobile ? (
    <div
      className={`fixed inset-0 z-50 bg-[#000000b8] bg-opacity-20 flex lg:hidden transition-opacity duration-300 ${
        showSidebar
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-base-100 w-64 p-4 rounded-xl shadow-md h-full overflow-y-auto overflow-x-hidden transform transition-transform duration-300 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ minWidth: "16rem", maxWidth: "100vw" }}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg">Filter</span>
          <button
            className="btn btn-sm btn-circle"
            onClick={() => setShowSidebar(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {/* Sidebar content */}
        <SidebarContent
          search={search}
          setSearch={setSearch}
          categories={categories}
          showAllCategories={showAllCategories}
          setShowAllCategories={setShowAllCategories}
        />
      </div>
      {/* Click outside to close */}
      <div
        className="flex-1"
        onClick={() => setShowSidebar(false)}
        aria-label="Close sidebar"
      />
    </div>
  ) : (
    <SidebarContent
      search={search}
      setSearch={setSearch}
      categories={categories}
      showAllCategories={showAllCategories}
      setShowAllCategories={setShowAllCategories}
    />
  );
}

function SidebarContent({
  search,
  setSearch,
  categories,
  showAllCategories,
  setShowAllCategories,
}) {
  return (
    <aside className="sidebar-scroll lg:w-64 lg:bg-base-100 lg:p-4 lg:rounded-xl lg:shadow-md lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto lg:overflow-x-hidden">
      {/* Search Filter */}
      <div className="mb-6 pb-4 border-b border-base-300">
        <h3 className="font-semibold text-sm text-gray-700 mb-2">Search</h3>
        <input
          type="text"
          placeholder="Search products..."
          className="input input-bordered w-full input-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* Category */}
      <div className="mb-6 pb-4 border-b border-base-300">
        <h3 className="font-semibold text-sm text-gray-700 mb-2">Category</h3>
        <div className="space-y-2">
          {(showAllCategories ? categories : categories.slice(0, 3)).map(
            (cat, idx) => {
              const catName = typeof cat === "string" ? cat : cat.name || "";
              return (
                <label
                  key={catName + idx}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input type="checkbox" className="checkbox checkbox-sm" />
                  <span className="text-sm capitalize">
                    {catName.replace(/-/g, " ")}
                  </span>
                </label>
              );
            }
          )}
          {categories.length > 3 && (
            <button
              className="btn btn-xs btn-ghost text-primary mt-2"
              onClick={() => setShowAllCategories((prev) => !prev)}
            >
              {showAllCategories ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>
      {/* Store Type */}
      <div className="mb-6 pb-4 border-b border-base-300">
        <h3 className="font-semibold text-sm text-gray-700 mb-2">Store Type</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span className="text-sm">Mall</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span className="text-sm">Power Shop</span>
          </label>
        </div>
      </div>
      {/* Location */}
      <div className="mb-6 pb-4 border-b border-base-300">
        <h3 className="font-semibold text-sm text-gray-700 mb-2">Location</h3>
        <div className="space-y-2">
          {["Jakarta", "Jabodetabek", "Bandung", "Medan", "Surabaya"].map(
            (city) => (
              <label
                key={city}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input type="checkbox" className="checkbox checkbox-sm" />
                <span className="text-sm">{city}</span>
              </label>
            )
          )}
        </div>
      </div>
      {/* Price */}
      <div className="mb-6 pb-4 border-b border-base-300">
        <h3 className="font-semibold text-sm text-gray-700 mb-2">Price</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="input input-bordered input-sm w-full"
          />
          <input
            type="number"
            placeholder="Max"
            className="input input-bordered input-sm w-full"
          />
        </div>
      </div>
      {/* Condition */}
      <div>
        <h3 className="font-semibold text-sm text-gray-700 mb-2">Condition</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span className="text-sm">New</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span className="text-sm">Used</span>
          </label>
        </div>
      </div>
    </aside>
  );
}
