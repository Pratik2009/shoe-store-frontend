import React, { useState } from "react";
import Wrapper from "@/components/wrapper";
import { IoMdHeartEmpty } from "react-icons/io";
import ProductDetailCarousal from "@/components/ProductDetailCarousal";
import ReletedProducts from "@/components/ReletedProducts";
import { fetchDataFromApi } from "@/utils/api";
import ReactMarkdown from "react-markdown";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Productdetails({ product, products }) {
  // console.log(product);
  // console.log(products);

  const [selectedSize, setSelectedSize] = useState();
  const [showError, setShowErro] = useState(false);

  const dispatch = useDispatch();

  const discount =
    product?.data?.[0]?.original_price && product?.data?.[0]?.price
      ? Math.round(
          ((product?.data?.[0]?.original_price - product?.data?.[0]?.price) /
            product?.data?.[0]?.original_price) *
            100
        )
      : 0;

  const notify = () => {
    toast.success("Success. Check your cart!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <div className="w-full md:py-20">
      <ToastContainer />
      <Wrapper>
        <div className="flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px]">
          <div className="w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full mx-auto lg:mx-0">
            <ProductDetailCarousal images={product?.data?.[0]?.image || []} />
          </div>
          <div className="flex-[1] py-3">
            <div className="text-[34px] font-semibold mb-2 leading-tight">
              {product?.data?.[0]?.name}
            </div>
            <div className="text-lg font-semibold mb-5">
              {product?.data?.[0]?.subtitle}
            </div>

            <div className="flex items-center">
              <p className="mr-2 text-lg font-semibold">
                MRP : &#8377;{product?.data?.[0]?.price}
              </p>

              {product?.data?.[0]?.original_price && (
                <>
                  <p className="text-base font-family line-through ">
                    &#8377;{product?.data?.[0]?.original_price}
                  </p>

                  <p className="ml-auto text-base font-medium text-green-500">
                    {discount}% off
                  </p>
                </>
              )}
            </div>

            <div className="text-md font-medium text-black/[0.5]">
              incl. of taxes
            </div>
            <div className="text-md font-medium text-black/[0.5] mb-20">
              {`(Also includes all applicable duties)`}
            </div>

            <div className="mb-10">
              <div className=" felx justify-between mb-2 ">
                <div className="text-mb font-semibold">Select size</div>
                <div className="text-md font-medium text-black/[0.5]">
                  Select Guide
                </div>
              </div>

              <div id="sizesGrid" className="grid grid-cols-3 gap-2">
                {product?.data?.[0]?.size.data.map((item, i) => (
                  <div
                    key={i}
                    className={`border rounded-md text-center py-3 font-medium  ${
                      item.enabled
                        ? "hover:border-black cursor-pointer"
                        : "cursor-not-allowed  text-black/[0.5] bg-black/[0.1] opacty-50"
                    } ${selectedSize === item.size ? "border-black" : ""} `}
                    onClick={() => {
                      setSelectedSize(item.size);
                      setShowErro(false);
                    }}
                  >
                    {item.size}
                  </div>
                ))}
              </div>

              {showError && (
                <div className="text-red-600 mt-1">
                  Size selction is required
                </div>
              )}
            </div>

            <button
              className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform activate:scale-95 mb-3 hover:opacity-75"
              onClick={() => {
                if (!selectedSize) {
                  setShowErro(true);
                  document
                    .getElementById("sizesGrid")
                    .scrollIntoView({ block: "center", behavior: "smooth" });
                } else {
                  dispatch(
                    addToCart({
                      ...product?.data?.[0],
                      selectedSize,
                      oneQuantity: product?.data?.[0]?.price,
                    })
                  );
                  notify();
                }
              }}
            >
              Add to cart
            </button>

            <button className="w-full py-4 rounded-full border border-black text-lg font-medium transition-transform activate-scale-95 flex item-center justify-center gap-2 hover:opacity-75 mb-10">
              Whishlist
              <IoMdHeartEmpty size={20} />
            </button>

            <div>
              <div className="text-lg font-bold mb-5">Product details</div>

              <div className="text-md mb-5">
                <div>
                  {product?.data?.[0]?.description?.[0]?.children?.[0]?.text}
                </div>

                <div className="markdown list-disc m-5 p-0">
                  <ul>
                    <li className="my-2.5">
                      {
                        product?.data?.[0]?.description?.[2]?.children?.[0]
                          ?.children?.[0]?.text
                      }
                    </li>
                    <li>
                      <div className="my-2.5">
                        {" "}
                        {
                          product?.data?.[0]?.description?.[3]?.children[0]
                            ?.children[0]?.text
                        }
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReletedProducts product={products} />
      </Wrapper>
    </div>
  );
}

export default Productdetails;

export async function getServerSideProps(context) {
  const { slug } = context.params;

  try {
    const product = await fetchDataFromApi(
      `/api/products?populate= *&filters[slug][$eqi]=${slug}`,
      false
    );

    const products = await fetchDataFromApi(
      `/api/products?populate=*&filters[slug][$ne]=${slug}`,
      false
    );

    return {
      props: {
        product,
        products,
      },
    };
  } catch (error) {
    console.error("Error fetching product/products:", error);

    return {
      props: {
        product: null,
        products: null,
      },
    };
  }
}
