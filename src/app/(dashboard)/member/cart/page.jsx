"use client";

import PageLoader from "@/components/Loaders/PageLoader";
import React, { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";

export default function CartPage() {
  const [shipping, setShipping] = useState("store");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const res = await fetch("/api/tunnel/carts/user/" + user.id);
        const data = await res.json();
        setCartItems(data?.carts[0]?.products || []);
      } catch (error) {
        console.error("Gagal fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCartItems();
  }, []);

  // Update qty
  const updateQty = (id, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        return item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item;
      })
    );
  };

  // Hapus item
  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCost = shipping === "delivery" ? 9.9 : 0;
  const total = subtotal + shippingCost;

  return (
    <div className="p-8 bg-base-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Cart</h1>
        <button className="btn btn-outline">Continue shopping</button>
      </div>

      {/* Jika loading, tampilkan skeleton */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-3 md:grid-cols-12 gap-4 items-center border-b pb-4"
            >
              <div className="col-span-4 md:col-span-2 flex justify-center">
                <div className="skeleton w-40 h-40 md:w-20 md:h-20 rounded"></div>
              </div>
              <div className="col-span-4 space-y-2">
                <div className="skeleton h-4 w-32"></div>
                <div className="skeleton h-3 w-20"></div>
                <div className="skeleton h-3 w-16"></div>
              </div>
              <div className="col-span-2">
                <div className="skeleton h-4 w-16"></div>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="skeleton w-6 h-6"></div>
                <div className="skeleton w-8 h-4"></div>
                <div className="skeleton w-6 h-6"></div>
              </div>
              <div className="col-span-2">
                <div className="skeleton h-4 w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-3 md:grid-cols-12 gap-4 items-center border-b pb-4 relative"
              >
                <div className="col-span-4 md:col-span-2 flex items-center justify-center">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-40 h-40 md:w-20 md:h-20 object-cover"
                  />
                </div>
                <div className="col-span-4">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.code}</p>
                  <p className="text-sm text-green-600">
                    Disc: {item.discountPercentage}%
                  </p>
                </div>
                <div className="col-span-2 font-bold">
                  $ {item.price.toFixed(2)}
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <button
                    className="btn btn-xs"
                    onClick={() => updateQty(item.id, -1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="btn btn-xs"
                    onClick={() => updateQty(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                <div className="col-span-2 font-bold flex items-center text-lg">
                  <div className="block md:hidden mr-2">Total: </div>${" "}
                  {(item.price * item.quantity).toFixed(2)}
                </div>

                {/* Tombol Delete */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-primary"
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}

            {cartItems.length === 0 && (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            )}
          </div>
        </>
      )}

      {/* Shipping */}
      <div className="bg-base-200 p-6 rounded-xl mt-6 flex gap-6 flex-wrap">
        <div className="flex-1">
          <h3 className="font-bold mb-4">Choose shipping mode:</h3>
          <div className="form-control flex flex-col gap-2">
            <label className="label cursor-pointer justify-start gap-4">
              <input
                type="radio"
                name="shipping"
                className="radio radio-primary"
                checked={shipping === "store"}
                onChange={() => setShipping("store")}
              />
              <span className="whitespace-pre-wrap">
                Store pickup (1-2 days) —{" "}
                <strong className="text-primary">FREE</strong>
              </span>
            </label>
            <label className="label cursor-pointer justify-start gap-4">
              <input
                type="radio"
                name="shipping"
                className="radio"
                checked={shipping === "delivery"}
                onChange={() => setShipping("delivery")}
              />
              <span className="whitespace-pre-wrap">
                Delivery at home (2-4 days) — <strong>9.90€</strong>
              </span>
            </label>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-base-100 p-4 rounded-xl shadow-md w-full max-w-[290px] md:max-w-[250px] md:min-w-[250px]">
          {loading ? (
            <>
              <div className="skeleton h-4 w-full mb-2"></div>
              <div className="skeleton h-4 w-full mb-2"></div>
              <div className="skeleton h-4 w-full mb-4"></div>
              <div className="skeleton h-10 w-full"></div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span>Subtotal TTC</span>
                <span className="font-bold">$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold">
                  {shippingCost === 0 ? "Free" : `$ ${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between mt-2 border-t pt-2">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg text-primary">
                  $ {total.toFixed(2)}
                </span>
              </div>
              <button className="btn btn-primary w-full mt-4">Checkout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
