import React from "react";
import EasyBuyLogo from "../../assets/vite.svg";

const NavbarBrand = () => {
  return (
    <div className="flex items-center gap-2">
      <img src={EasyBuyLogo} alt="EasyBuy" className="w-5" />
      <h1 className="font-Inter font-bold text-neutral-950 dark:text-neutral-100 text-balance">
        EasyBuy
      </h1>
    </div>
  );
};

export default NavbarBrand;
