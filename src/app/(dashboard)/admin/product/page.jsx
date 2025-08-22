"use client";

import DataTable, { actionColumn } from "@/components/Table/DataTable";
import Modal from "@/components/Modals/Modal";
import { useEffect, useRef, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [html, setHtml] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("https://dummyjson.com/products?limit=999");
      const data = await res.json();
      setProducts(data.products);
    };

    fetchProducts();
  }, []);

  const columns = [
    { name: "ID", width: "50px", sort: false, hidden: true },
    { name: "Title", width: "200px", sort: false },
    { name: "Description", width: "400px", sort: false },
    { name: "Category", width: "150px", sort: false },
    { name: "Price", width: "100px", sort: true },
    { name: "Stock", width: "100px", sort: true },
    actionColumn("products"),
  ];

  const rows = products.map((product) => {
    return [
      product.id,
      product.title,
      product.description,
      product.category,
      product.price,
      product.stock,
    ];
  });

  const openModal = () => {
    modalRef.current.showModal();
  };

  function handleAction({ id, action, type }) {
    // alert(`Tindakan: ${action} pada ${type} ID ${id}`);
    openModal();

    let html = `
      tes moda ${action} pada ${type} ID ${id}
    `;

    setHtml(html);
  }

  return (
    <div>
      <h1 className="text-primary text-2xl font-bold mb-4">Daftar Produk</h1>
      <div className="bg-base-100 rounded-md p-4">
        <DataTable columns={columns} rows={rows} onAction={handleAction} />
      </div>
      <Modal ref={modalRef}>{html}</Modal>
    </div>
  );
}
