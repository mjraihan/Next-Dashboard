"use client";

export default function CardProduct({ product, notify }) {
  return (
    <div className="card bg-base-100 border border-base-200 rounded-xl shadow-sm hover:shadow-lg hover:border-primary transition relative cursor-pointer">
      {/* Discount Badge */}
      {product.discountPercentage > 0 && (
        <div className="absolute top-2 left-2">
          <span className="badge badge-error text-xs">
            -{Math.round(product.discountPercentage)}%
          </span>
        </div>
      )}

      {/* Image */}
      <figure className="px-4 pt-6 bg-zinc-800 rounded-xl">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="rounded-lg h-40 object-contain transition-transform duration-300 hover:scale-105"
        />
      </figure>

      {/* Body */}
      <div className="card-body p-4">
        {/* Product Title */}
        <h2 className="text-sm font-bold line-clamp-1 h-[20px] overflow-y-hidden">
          {product.title}
        </h2>

        {/* Price */}
        <div>
          <span className="text-lg font-bold text-primary block">
            $ {product.price.toLocaleString("id-ID")}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-xs text-gray-400 line-through">
              $
              {(
                product.price /
                (1 - product.discountPercentage / 100)
              ).toLocaleString("id-ID")}
            </span>
          )}
        </div>

        {/* Rating & Sold */}
        <div className="flex items-center justify-between gap-2 mt-2 text-xs text-gray-500">
          <span>⭐ {product.rating}</span>
          <span>{product.stock}+ sold</span>
        </div>

        {/* Button */}
        <div className="mt-3">
          <button
            className="btn btn-sm btn-primary w-full rounded-lg"
            onClick={() => notify(product.title)}
          >
            + Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
