import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "./ProductCard";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useState, useEffect } from "react";

function ReletedProducts({product}) {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };


  const [
    Loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  
  return (
    <div className="mt-[50px] md:mt-[100px] mb-[100px] md:mb-0">
      <div className="text-2xl font-bold mb-5">You Might Also Like</div>
      <Carousel 
        responsive={responsive}
        containerClass="-mx-[10px]"
        itemClass="px-[10px]"
        >
         {Loading
          ? [Array].map((p, idx) => (
              <div className="col" key={idx}>
                <Skeleton width={386} height={350} />
                
              </div>
            ))
          : 
         
          product?.data?.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))
        }

        
      </Carousel>
      
    </div>
  );
}

export default ReletedProducts;
