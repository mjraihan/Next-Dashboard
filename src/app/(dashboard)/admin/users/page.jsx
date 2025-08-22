"use client";

import DataTable, { actionColumn } from "@/components/Table/DataTable";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("https://dummyjson.com/users?limit=999");
      const data = await res.json();
      setUsers(data.users);
    };

    fetchUsers();
  }, []);

  const columns = [
    { name: "ID", width: "50px", sort: false, hidden: true },
    { name: "Username", width: "150px", sort: false },
    { name: "Email", width: "220px", sort: false },
    { name: "Phone", width: "150px", sort: false },
    { name: "Gender", width: "100px", sort: true },
    { name: "Address", width: "100px", sort: true },
    { name: "Role", width: "100px", sort: true },
    actionColumn("users"),
  ];

  const rows = users.map((user) => {
    return [
      user.id,
      user.username,
      user.email,
      user.phone,
      user.gender,
      user.address?.country,
      user.role,
    ];
  });

  function handleAction({ id, action, type }) {
    alert(`Tindakan: ${action} pada ${type} ID ${id}`);
  }

  return (
    <div>
      <h1 className="text-primary text-2xl font-bold mb-4">Daftar User</h1>
      <div className="bg-base-100 rounded-md p-4">
        <DataTable columns={columns} rows={rows} onAction={handleAction} />
      </div>
    </div>
  );
}
