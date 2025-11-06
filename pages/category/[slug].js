import React, { useEffect, useState } from "react";
import Wrapper from "@/components/wrapper";
import ProductCard from "@/components/ProductCard";
import { fetchDataFromApi } from "@/utils/api";
import { useRouter } from "next/router";
import useSWR from "swr";

function Category({ categories, products, slug }) {
  // console.log(categories);
  // console.log(products);

  const [pageIndex, setPageIndex] = useState(1);
  const { query } = useRouter();

  useEffect(() => {
    setPageIndex(1);
  }, [query]);

  const { data, error, isLoading } = useSWR(
    `/api/products?populate=*&filters[categories][slug][$eq]=${slug}&pagination[page]=${pageIndex}&pagination[pageSize]=3`,
    fetchDataFromApi,
    {
      fallback: products,
    }
  );

  const [loading, setIsLoading]= useState(false);
  return (
    <div className="w-full md:py-20">
      <Wrapper>
        <div className="text-center max-w-[800px] mx-auto mt-8 md:mt-0">
          <div className="text-[20px] md:text-[34px] mb-5 font-semibold leading-tight">
            {categories?.data?.[0].name}
          </div>
          
        </div>
        

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-14 px-5 md:px-0">
          {data?.data?.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
        {/* PAGINATION BUTTONS START */}
        {data?.meta?.pagination?.total > 3 && (
          <div className="flex gap-3 items-center justify-center my-16 md:my-0">
            <button
              className={`rounded py-2 px-4 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500`}
              disabled={pageIndex === 1}
              onClick={() => setPageIndex(pageIndex - 1)}
            >
              Previous
            </button>

            <span className="font-bold">{`${pageIndex} of ${
              data && data.meta.pagination.pageCount
            }`}</span>

            <button
              className={`rounded py-2 px-4 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500`}
              disabled={pageIndex === (data && data.meta.pagination.pageCount)}
              onClick={() => setPageIndex(pageIndex + 1)}
            >
              Next
            </button>
          </div>
        )}
        {/* PAGINATION BUTTONS END */}
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-white/[0.5] flex flex-col gap-5 justify-center items-center">
            <img src="/images/logo.svg" width={150} />
            <span className="text-2xl font-medium">Loading...</span>
          </div>
        )}

        
      </Wrapper>
    </div>
  );
}

export default Category;

export async function getServerSideProps(context) {
  const { slug, pg } = context.params;
  let pageNumber = 1;

  if (pg !== undefined) {
    pageNumber = parseInt(pg);
  }

  try {
    const categories = await fetchDataFromApi(
      `/api/categories?filters[slug][$eq]=${slug}`,
      false
    );

    const products = await fetchDataFromApi(
      `/api/products?populate=*&filters[categories][slug][$eq]=${slug}&pagination[page]=1&pagination[pageSize]=3`,
      false
    );

    const total = products?.total || 0;

    return {
      props: {
        categories,
        products,
        slug,
      },
    };
  } catch (error) {
    console.error("Error fetching category/products:", error);

    return {
      props: {
        categories: null,
        products: null,
        slug: null,
      },
    };
  }
}
