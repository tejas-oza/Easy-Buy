import React from "react";
import { LuMenu, LuMoon, LuSunMedium, LuX } from "react-icons/lu";
import NavbarMenu from "./NavbarMenu";
import Button from "../ui/Button";
import viteLogo from "../../assets/vite.svg";

const Navbar = ({
  handleDarkMode,
  isDarkMode,
  handleMobileMenu,
  isMobileMenuOpen,
}) => {
  return (
    <nav className="w-full flex items-center justify-between shadow px-5 py-3 bg-white dark:bg-zinc-950 fixed top-0  dark:border-b dark:border-b-zinc-800">
      <Logo />

      <div className="flex items-center gap-2">
        <NavbarMenu />

        <Button
          className={"shadow-none"}
          variant={"base"}
          size={"icon"}
          onClick={() => handleDarkMode()}
        >
          {isDarkMode ? <LuMoon size={20} /> : <LuSunMedium size={20} />}
        </Button>

        <Button
          className={"shadow-none md:hidden"}
          variant={"base"}
          size={"icon"}
          onClick={() => handleMobileMenu()}
        >
          {isMobileMenuOpen ? <LuX size={20} /> : <LuMenu size={20} />}
        </Button>
      </div>
    </nav>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center gap-2 font-Inter font-bold text-lg text-zinc-950 dark:text-zinc-50">
      <img src={viteLogo} alt="EasyBuy" className="w-5" />
      EasyBuy
    </div>
  );
};

export default Navbar;
