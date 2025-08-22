"use client";
import { useState, useEffect, useRef } from "react";
import CardPosting from "@/components/Card/CardPosting";
import { useUser } from "@/contexts/UserContext";

const hashtags = [
  {
    tag: "Programming",
    name: "#ReactJS",
    posts: "44k",
  },
  {
    tag: "Web Development",
    name: "#NextJS",
    posts: "32k",
  },
  {
    tag: "Web Development",
    name: "#WebDevelopment",
    posts: "28k",
  },
  {
    tag: "Programming",
    name: "#JavaScript",
    posts: "50k",
  },
  {
    tag: "AI",
    name: "#OpenAI",
    posts: "12k",
  },
];

function SkeletonPost() {
  return (
    <div className="card bg-base-100 shadow-lg mb-6 animate-pulse">
      <div className="card-body flex gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <div className="w-12 h-12 rounded-full bg-base-300" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-base-300 rounded w-3/4" />
              <div className="h-3 bg-base-300 rounded w-1/2" />
            </div>
          </div>
          <div className="h-8 bg-base-300 rounded mt-2 w-full" />
        </div>
      </div>
    </div>
  );
}

function SkeletonSuggestion() {
  return (
    <ul className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, idx) => (
        <li key={idx} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-base-300" />
          <div>
            <div className="h-4 bg-base-300 rounded w-20 mb-1" />
            <div className="h-3 bg-base-300 rounded w-16" />
          </div>
          <div className="btn btn-xs btn-outline ml-auto bg-base-300 border-none text-base-300 pointer-events-none">
            &nbsp;
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [suggestionUsers, setSuggestionUsers] = useState([]);
  const [loadingSuggestion, setLoadingSuggestion] = useState(true);
  const [users, setUsers] = useState([]);
  const [sidebarStyle, setSidebarStyle] = useState({});
  const session = useUser();
  const postsPerPage = 3;
  const loaderRef = useRef();

  // Fetch all users for posts and suggestion
  useEffect(() => {
    fetch("/api/tunnel/users?limit=9999")
      .then((res) => res.json())
      .then((data) => {
        const userList = data.users.map((user) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.image,
          username: `@${user.username}`,
        }));
        setUsers(userList);
        setSuggestionUsers(userList.slice(0, 3));
        setLoadingSuggestion(false);
      });
  }, []);

  // Tidak ada user static saat posting
  const handlePost = () => {
    if (!postText.trim()) return;
    setPostText("");
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
  }, []);

  // Fetch posts with pagination
  useEffect(() => {
    async function fetchPosts() {
      setLoadingPosts(true);
      const skip = (page - 1) * postsPerPage;
      const postsRes = await fetch(
        `/api/tunnel/posts?limit=${postsPerPage}&skip=${skip}`
      );
      const postsData = await postsRes.json();

      const commentsRes = await fetch("/api/tunnel/comments?limit=9999");
      const commentsData = await commentsRes.json();
      const comments = commentsData.comments;

      const postsWithUserAndComments = postsData.posts.map((post) => {
        const user = users.find((u) => u.id === post.userId);
        const postComments = comments
          .filter((c) => c.postId === post.id)
          .map((c) => {
            const commentUser = users.find((u) => u.id === c.user.id);
            return {
              id: c.id,
              user: {
                name: commentUser ? commentUser.name : "Unknown",
                avatar: commentUser
                  ? commentUser.avatar
                  : "https://randomuser.me/api/portraits/lego/1.jpg",
              },
              text: c.body,
            };
          });

        return {
          id: post.id,
          user: {
            name: user ? user.name : "Unknown",
            avatar: user
              ? user.avatar
              : "https://randomuser.me/api/portraits/lego/1.jpg",
          },
          date: "2025-08-21",
          content: post.body,
          comments: postComments,
        };
      });

      // Jika page === 1, replace posts, jika > 1, append
      setPosts((prev) =>
        page === 1
          ? postsWithUserAndComments
          : [...prev, ...postsWithUserAndComments]
      );
      setLoadingPosts(false);
      setLoadingMore(false);
    }

    if (users.length > 0) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, users]);

  // Infinite scroll handler
  useEffect(() => {
    function handleScroll() {
      if (loadingPosts || loadingMore) return;
      if (!loaderRef.current) return;
      const rect = loaderRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    }
    window.addEventListener("scroll", handleScroll); // <-- event listener memanggil handleScroll setiap scroll
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingPosts, loadingMore]);

  // Sticky sidebar logic
  useEffect(() => {
    function handleSidebarScroll() {
      const mainFeed = document.getElementById("main-feed");
      const sidebar = document.getElementById("sidebar-content");
      if (!mainFeed || !sidebar) return;

      const mainFeedRect = mainFeed.getBoundingClientRect();
      const sidebarRect = sidebar.getBoundingClientRect();

      const mainFeedBottom = mainFeedRect.bottom;
      const sidebarBottom = sidebarRect.bottom;

      if (sidebarBottom > mainFeedBottom) {
        setSidebarStyle({
          position: "absolute",
          top: `${mainFeedRect.height - sidebarRect.height}px`,
          width: "100%",
        });
      } else {
        setSidebarStyle({
          position: "sticky",
          top: "2rem",
          width: "100%",
        });
      }
    }

    window.addEventListener("scroll", handleSidebarScroll);
    window.addEventListener("resize", handleSidebarScroll);
    handleSidebarScroll();

    return () => {
      window.removeEventListener("scroll", handleSidebarScroll);
      window.removeEventListener("resize", handleSidebarScroll);
    };
  }, [posts, suggestionUsers]);

  return (
    <div className="bg-base-200 min-h-screen flex justify-center px-2 py-8">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-5 relative">
        {/* Main Feed */}
        <div className="flex-1 min-w-0" id="main-feed">
          {/* Post Box */}
          <div className="card bg-base-100 shadow-lg mb-6">
            <div className="card-body flex gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <img
                    src={session.image}
                    alt={session.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="What's happening?"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    rows={3}
                  />
                </div>
                <button
                  className="btn btn-primary mt-2 float-right"
                  onClick={handlePost}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          {/* Posts */}
          <div className="space-y-6">
            {loadingPosts && posts.length === 0
              ? [...Array(postsPerPage)].map((_, i) => <SkeletonPost key={i} />)
              : posts.map((post) => (
                  <CardPosting key={post.id} post={post} session={session} />
                ))}
            {/* Load More Button */}
            <div className="flex justify-center py-4">
              <button
                className="btn btn-outline btn-primary btn-block"
                disabled={loadingPosts || loadingMore}
                onClick={() => {
                  setLoadingMore(true);
                  setPage((prev) => prev + 1);
                }}
              >
                {loadingMore ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Sidebar Wrapper */}
        <div
          className="w-full md:w-80 flex-shrink-0"
          style={{ position: "relative" }}
        >
          <div id="sidebar-content" className="space-y-6" style={sidebarStyle}>
            {/* Search */}
            <div className="card bg-base-100 shadow-lg p-4">
              <h3 className="font-bold mb-3">Search</h3>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Search..."
              />
            </div>
            {/* Trending Keywords */}
            <div className="card bg-base-100 shadow-lg p-4">
              <h3 className="font-bold mb-3">Trending Keywords</h3>
              <ul className="space-y-2">
                {hashtags.map((v, i) => (
                  <li
                    key={i}
                    className="hover:bg-base-200 p-2 rounded cursor-pointer duration-100 ease-in"
                  >
                    <div className="text-xs text-gray-600">
                      Trending on {v.tag}
                    </div>
                    <div className="text-primary font-semibold">{v.name}</div>
                    <div className="text-xs text-gray-500">{v.posts} Posts</div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Suggestion Users */}
            <div className="card bg-base-100 shadow-lg p-4">
              <h3 className="font-bold mb-3">Suggestion to Visit</h3>
              {loadingSuggestion ? (
                <SkeletonSuggestion />
              ) : (
                <ul className="space-y-4">
                  {suggestionUsers.map((user, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.username}</p>
                      </div>
                      <button className="btn btn-xs btn-outline ml-auto">
                        Visit
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
