import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

function ProductDetailCarousal({ images = [] }) {
  
  return (
    <div className="text-white text-[20px] w-full max-w-[1360px] mx-auto sticky top-[50px]">
      <Carousel
        infiniteLoop={true}
        showIndicators={false}
        showStatus={false}
        thumbWidth={60}
        className="ProductCarousal"
      >
        {images.map((img) => (
          <img
            key={img.id}
            src={img.url} 
            alt={img.name || "Product image"}
          />
        ))}

       
      </Carousel>
    </div>
  );
}

export default ProductDetailCarousal;
