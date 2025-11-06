import Image from "next/image";
import Link from "next/link";
import React from "react";

function ProductCard({ data }) {
  const product = data?.attributes || data;

  const discount =
    product?.original_price && product?.price
      ? Math.round(((product?.original_price - product?.price) / product?.original_price) * 100)
      : 0;
  

  return (
    <Link
      href={`/product/${product?.slug}`}
      className="block transform overflow-hidden bg-white duration-200 hover:scale-105 cursor-pointer rounded-lg shadow-sm"
    >
      <div className="relative w-full h-[350px]">
        <Image
          fill
          src={product?.thumbnail?.url}
          alt={product?.name}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="p-4 text-black/[0.9]">
        <h2 className="text-lg font-medium mb-1">{product?.name}</h2>

        <div className="flex items-center text-black/[0.6]">
          <p className="mr-2 text-lg font-semibold">₹{product?.price}</p>

          {product?.original_price && (
            <>
              <p className="text-base line-through">₹{product?.original_price}</p>
              <p className="ml-auto text-sm text-green-600 font-medium">
                {discount}% off
              </p>
            </>
          )}

          
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
