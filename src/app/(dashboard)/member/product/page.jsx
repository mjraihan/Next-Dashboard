"use client";

import { useEffect, useState, useRef } from "react";
import SidebarFilter from "@/components/Sidebar/SidebarFilter";
import CardSkeleton from "@/components/Loaders/CardSkeleton";
import CardProduct from "@/components/Card/CardProduct";
import { Slide, ToastContainer, toast } from "react-toastify";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const limit = 16;
  const notify = (msg) =>
    toast.success(
      <div>
        <span className="font-extrabold text-primary">{msg}</span> added to cart
      </div>,
      {
        className: "text-xs",
      }
    );

  // State for loading more
  const [loadingMore, setLoadingMore] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const debounceTimeout = useRef();

  useEffect(() => {
    // Clear timeout jika search berubah sebelum 500ms
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce
    return () => clearTimeout(debounceTimeout.current);
  }, [search]);

  // Fetch products, with search and pagination support
  useEffect(() => {
    setLoading(page === 0); // only show main skeleton on first load
    let url = `/api/tunnel/products?limit=${limit}&skip=${page * limit}`;
    if (debouncedSearch.trim()) {
      url = `/api/tunnel/products/search?q=${encodeURIComponent(
        debouncedSearch
      )}&limit=${limit}&skip=${page * limit}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setTotal(data.total);
        setProducts((prev) =>
          page === 0 ? data.products : [...prev, ...data.products]
        );
        setHasMore((page + 1) * limit < data.total);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
    // eslint-disable-next-line
  }, [debouncedSearch, page]);

  // Reset page when search changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  // Fetch categories from dummyjson
  useEffect(() => {
    fetch("/api/tunnel/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="flex gap-6 bg-base-200 min-h-screen relative">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <SidebarFilter
          search={search}
          setSearch={setSearch}
          categories={categories}
          showAllCategories={showAllCategories}
          setShowAllCategories={setShowAllCategories}
        />
      </div>

      {/* Sidebar Mobile */}
      <SidebarFilter
        isMobile
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        search={search}
        setSearch={setSearch}
        categories={categories}
        showAllCategories={showAllCategories}
        setShowAllCategories={setShowAllCategories}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Sorting & Setting Button */}
        <div className="flex justify-between lg:justify-end items-center mb-4 gap-2">
          {/* Filter Button (mobile only) */}
          <button
            className="btn btn-outline btn-sm lg:hidden"
            onClick={() => setShowSidebar(true)}
          >
            Filter
          </button>
          <select className="select select-bordered w-52">
            <option>Most Relevant</option>
            <option>Cheapest</option>
            <option>Most Expensive</option>
            <option>Bestseller</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading && page === 0
            ? Array.from({ length: 8 }).map((_, idx) => (
                <CardSkeleton key={idx} />
              ))
            : products.map((product) => (
                <CardProduct
                  key={product.id}
                  product={product}
                  notify={notify}
                />
              ))}
          <ToastContainer
            position="bottom-right"
            theme="dark"
            newestOnTop={false}
            transition={Slide}
            limit={4}
            draggable
          />
        </div>
        {/* Load More Skeleton & Button */}
        {!loading && hasMore && (
          <div className="flex flex-col items-center py-8 w-full">
            {loadingMore && (
              <div className="w-full mb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({
                    length:
                      typeof window !== "undefined"
                        ? window.innerWidth >= 1024
                          ? 8
                          : 4
                        : 8,
                  }).map((_, idx) => (
                    <CardSkeleton key={idx} />
                  ))}
                </div>
              </div>
            )}
            {!loadingMore && (
              <button
                className="btn btn-outline"
                onClick={() => {
                  setLoadingMore(true);
                  setPage((prev) => prev + 1);
                }}
              >
                Load More
              </button>
            )}
          </div>
        )}

        {/* All products loaded */}
        {!hasMore && products.length === total && (
          <div className="text-center py-8 text-gray-500 font-semibold">
            All products have been displayed.
          </div>
        )}
      </main>

      {/* Global scrollbar style */}
      <style jsx global>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 6px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
      `}</style>
    </div>
  );
}
