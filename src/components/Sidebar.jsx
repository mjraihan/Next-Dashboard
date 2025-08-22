"use client";

import "@/styles/sidebar.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import {
  MdDashboard,
  MdShoppingBasket,
  MdAccountCircle,
  MdWysiwyg,
  MdOutlineTableChart,
  MdMenu,
} from "react-icons/md";

const menu = [
  {
    name: "Dashboard",
    path: "/common/home",
    icon: <MdDashboard />,
    section: "navigaton",
    role: "global",
  },
  {
    name: "Product",
    path: "/admin/product",
    icon: <MdShoppingBasket />,
    section: "navigaton",
    role: "admin",
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <MdAccountCircle />,
    section: "navigaton",
    role: "admin",
  },
  {
    name: "Post",
    path: "/admin/post",
    icon: <MdWysiwyg />,
    section: "navigaton",
    role: "admin",
  },
  {
    name: "Profile",
    path: "/member/profile",
    icon: <MdAccountCircle />,
    section: "navigaton",
    role: "user",
  },
  {
    name: "Product",
    path: "/member/product",
    icon: <FaCartPlus />,
    section: "navigaton",
    role: "user",
  },
  {
    name: "Table",
    path: "/common/table",
    icon: <MdOutlineTableChart />,
    section: "utility",
    role: "global",
  },
  {
    name: "Forms",
    path: "/common/forms",
    icon: <LuClipboardList />,
    section: "utility",
    role: "global",
  },
];

export default function Sidebar({ children, user }) {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [cart, setCart] = useState([]);
  const pathname = usePathname();
  const router = useRouter();

  // Filter menu by role
  const filteredMenu = menu.filter((item) => {
    if (!user?.role) return false;
    if (user.role === "admin") {
      return item.role === "admin" || item.role === "global";
    }
    if (user.role === "user") {
      return item.role === "global" || item.role === "user";
    }
    return false;
  });

  // Grouping menu filter
  const groupedMenu = filteredMenu.reduce((acc, item) => {
    const section = item.section.toLowerCase();
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {});

  const handleLogout = async () => {
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      console.log("berhasil logout!");
      router.push("/auth/login");
    } else {
      console.log(res);
      alert("gagal logout!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/tunnel/carts/user/" + user.id);
        const data = await res.json();
        setCart(data?.carts[0] || []);
      } catch (error) {
        console.error("Gagal fetch data:", error);
      }
    };

    fetchData();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpenSidebar(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-screen flex">
      <div
        className={`sidebar-wrap fixed z-300 h-full p-4 lg:static lg:p-0 lg:translate-x-0 transition-all ${
          openSidebar ? "translate-x-0" : "translate-x-[-260px]"
        }`}
      >
        <div className="sidebar h-full bg-base-100 min-w-[240px] max-w-[240px] py-4 rounded-md lg:rounded-none">
          <div className="mb-6 px-4">
            <a className="font-bold text-2xl text-violet-500">DashApps</a>
          </div>
          <div className="max-h-[calc(100vh-100px)] overflow-x-auto px-4">
            {Object.entries(groupedMenu).map(([section, items]) => (
              <div key={section} className="mb-4">
                <div className="text-[10px] font-semibold mb-2 mt-4 capitalize">
                  {section}
                </div>
                <ul className="menu-list">
                  {items.map(({ name, icon, path }) => (
                    <li key={name}>
                      <Link href={path}>
                        <div
                          className={`flex items-center p-2 hover:bg-base-200 rounded-md cursor-pointer mb-2 ${
                            pathname === path ? "active" : ""
                          }`}
                        >
                          {icon}
                          <div className="text-sm font-semibold ml-2">
                            {name}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="navbar bg-base-100">
          <div className="w-full flex justify-between">
            <div>
              <button
                className="btn btn-ghost block lg:hidden"
                onClick={() => setOpenSidebar(!openSidebar)}
              >
                <MdMenu />
              </button>
            </div>
            <div className="flex justify-end">
              {user.role === "user" && (
                <div className="dropdown dropdown-end mr-4">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle"
                  >
                    <div className="indicator">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {" "}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />{" "}
                      </svg>
                      {cart?.totalProducts > 0 && (
                        <span className="badge badge-sm indicator-item bg-red-600 rounded-full">
                          {cart?.totalProducts}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    tabIndex={0}
                    className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow"
                  >
                    <div className="card-body gap-0">
                      <span className="text-lg font-bold mb-4">
                        {cart?.totalProducts} Items
                      </span>
                      <span className="text-error text-xs">
                        Discount: ${cart?.discountedTotal}
                      </span>
                      <span className="text-info">
                        Subtotal: ${cart?.total}
                      </span>
                      <hr className="my-2" />
                      <div className="card-actions">
                        <Link href="/member/cart">
                          <button className="btn btn-primary btn-block">
                            View cart
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src={user?.image}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <div className="block">
                      <div className="text-[14px]">
                        Hello, <b className="capitalize">{user?.username}</b>
                      </div>
                      <div className="capitalize text-primary font-bold">
                        {user?.role}
                      </div>
                      <hr className="my-2" />
                    </div>
                  </li>
                  <li>
                    <Link href="/member/profile">Profile</Link>
                  </li>
                  <li>
                    <div onClick={handleLogout}>Logout</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:max-w-[calc(100vw-240px)] h-[calc(100%-64px)] overflow-x-hidden overflow-y-auto bg-base-200 flex justify-center">
          {children}
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 w-screen h-screen bg-zinc-950 opacity-50 z-270 lg:hidden ${
          openSidebar ? "block" : "hidden"
        }`}
        onClick={() => setOpenSidebar(false)}
      ></div>
    </div>
  );
}
