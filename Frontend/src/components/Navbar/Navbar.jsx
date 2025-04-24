import React from "react";
import { LuMenu, LuMoon, LuSunMedium, LuX } from "react-icons/lu";
import NavbarBrand from "./NavbarBrand";
import NavbarMenu from "./NavbarMenu";

const Navbar = ({
  handleDarkMode,
  isDarkMode,
  handleMobileMenu,
  isMobileMenuOpen,
}) => {
  return (
    <nav className="w-full bg-neutral-100 dark:bg-neutral-800 p-5 flex items-center justify-between border-b border-b-neutral-200">
      <NavbarBrand />

      <div className="flex items-center gap-4">
        <NavbarMenu />
        <button
          onClick={() => handleDarkMode()}
          className="cursor-pointer p-1 border-2 border-neutral-200 rounded-md dark:border-neutral-600 "
        >
          {isDarkMode ? <LuMoon size={20} /> : <LuSunMedium size={20} />}
        </button>

        <button
          onClick={() => handleMobileMenu()}
          className="cursor-pointer md:hidden p-1 border-2 border-neutral-200 rounded-md dark:border-neutral-600 "
        >
          {isMobileMenuOpen ? <LuX size={20} /> : <LuMenu size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
