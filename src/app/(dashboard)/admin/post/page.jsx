"use client";

import DataTable, { actionColumn } from "@/components/Table/DataTable";
import { useEffect, useState } from "react";

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Bisa dijalankan paralel
        const [postsRes, usersRes] = await Promise.all([
          fetch("https://dummyjson.com/posts?limit=999"),
          fetch("https://dummyjson.com/users?limit=999"),
        ]);

        const postsData = await postsRes.json();
        const usersData = await usersRes.json();

        setPosts(postsData.posts);
        setUsers(usersData.users); // <- simpan user jika mau digunakan nanti
      } catch (error) {
        console.error("Gagal fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { name: "ID", width: "50px", sort: false, hidden: true },
    //{ name: "userID", width: "150px", sort: true, hidden: false },
    { name: "User", width: "150px", sort: false },
    { name: "Title", width: "200px", sort: false },
    { name: "Body", width: "400px", sort: false },
    { name: "Like", width: "150px", sort: true },
    { name: "View", width: "100px", sort: true },
    actionColumn("posts"),
  ];

  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  const rows = posts.map((post) => {
    const user = userMap[post.userId];
    return [
      post.id,
      //post.userId,
      user ? `${user.firstName} ${user.lastName}` : "Unknown",
      post.title,
      post.body,
      post.reactions?.likes ?? 0,
      post.views,
    ];
  });

  function handleAction({ id, action, type }) {
    alert(`Tindakan: ${action} pada ${type} ID ${id}`);
  }

  return (
    <div>
      <h1 className="text-primary text-2xl font-bold mb-4">Posts List</h1>
      <div className="bg-base-100 rounded-md p-4">
        <DataTable columns={columns} rows={rows} onAction={handleAction} />
      </div>
    </div>
  );
}
