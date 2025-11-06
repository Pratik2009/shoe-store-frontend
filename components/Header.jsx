import React, { useEffect, useState } from "react";
import Wrapper from "./wrapper";
import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";
import MenuMobile from "./MenuMobile";

import { IoMdHeartEmpty } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { BiMenuAltRight } from "react-icons/bi";
import { VcCart } from "react-icons/bs";
import { VscChromeClose } from "react-icons/vsc";
import { fetchDataFromApi } from "@/utils/api";
import { useSelector } from "react-redux";

const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showcatMenu, setShowCatMenu] = useState(false);
  const [show, setShow] = useState("translate-0");
  const [lastscrolly, setLastScrolly] = useState(0);
  const [categories, setCategories] = useState(null);

  const {cartItems} = useSelector((state => state.cart))
  
const controlNavbar=()=>{
    if(window.scrollY>200){
        if(window.scrollY > lastscrolly && !mobileMenu){
          setShow("-translate-y-[80px]")
        }else{
            setShow("shadow-sm")
        }
           
    }else{
        setShow("translate-y-0")
    }
}

  useEffect(()=>{
    window.addEventListener("scroll",controlNavbar);
    return ()=>{
        window.removeEventListener("scroll",controlNavbar)
    }
  },[lastscrolly])

  useEffect(()=>{
       fetchCategories();
  })

  const fetchCategories =async ()=>{
    const {data} = await fetchDataFromApi("/api/categories?populate=*")
    setCategories(data);
  };

  return (
    <div
      className={`w-full h-[50px] md:h-[80px] bg-white flex items-center justify-between z-20 sticky top-0 transition-transition duration-300 ${show}`}
    >
      <Wrapper className="h-[60px] flex justify-between items-center">
        <Link href="/">
          <Image src="/images/logo.svg" width={40} height={20} />
        </Link>
        <Menu showcatMenu={showcatMenu} setShowCatMenu={setShowCatMenu} categories ={categories} />

        {mobileMenu && <MenuMobile
          showcatMenu={showcatMenu}
          setShowCatMenu={setShowCatMenu}
          setMobileMenu={setMobileMenu}
          categories ={categories}
        />}

        <div className=" flex items-center gap-2 text-black">
          {/* Icons start */}
          <div
            className="w-8 md:w-12 h-8 md
        :h-8 md:w-12 rounder-fill flex justify-content-full justify-center items-center hover:-bg-black/[0.05] cursor-pointer relative"
          >
            <IoMdHeartEmpty className="text-[19px] md:text-[24px]" />
            <div
              className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white 
            text-[10px] md:text-[12px] flex justify-center items-center px-[2px]
            md:px-[5px]"
            >
              51
            </div>
          </div>
          {/* Icons End */}

          {/* Icons start */}
          <Link href="/Cart">
          <div
            className="w-8 md:w-12 h-8 md
        :h-8 md:w-12 rounder-fill flex justify-content-full justify-center items-center hover:-bg-black/[0.05] cursor-pointer relative"
          >
            <BsCart className="text-[15px] md:text-[20px]" />
           { cartItems?.length > 0 &&  ( <div
              className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white 
            text-[10px] md:text-[12px] flex justify-center items-center px-[2px]
            md:px-[5px]"
            >
              {cartItems.length}
            </div>
            )}
          </div>
          </Link>

          {/* Icons End */}

          {/* Mobile icons Start */}
          <div
            className="w-8 md:w-12 h-8 md
        :h-8 md:w-12 rounder-fill flex justify-content-full justify-center items-center hover:-bg-black/[0.05] cursor-pointer relative -mr-2
          "
          >
            {mobileMenu ? (
              <VscChromeClose
                className="text-[16px]"
                onClick={() => {
                  setMobileMenu(false);
                }}
              />
            ) : (
              <BiMenuAltRight
                className="text-[20px]"
                onClick={() => {
                  setMobileMenu(true);
                }}
              />
            )}
          </div>
          {/* Mobile icons end */}
        </div>
      </Wrapper>
    </div>
  );
};

export default Header;
