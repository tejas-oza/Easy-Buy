import React from "react";
import Button from "../ui/Button";
import NavbarMenu from "../Navbar/NavbarMenu";
import reactLogo from "../../assets/react.svg";
import { LuMenu, LuMoon, LuSunMedium, LuX } from "react-icons/lu";

const Navbar = ({
  handleDarkMode,
  isDarkMode,
  handleMobileMenu,
  isMobileMenuOpen,
}) => {
  return (
    <nav className="w-full flex items-center justify-between md:justify-around px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 fixed top-0 z-50">
      <NavLogo />

      <div className="flex items-center gap-2">
        <NavbarMenu />

        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => handleDarkMode()}
        >
          {isDarkMode ? <LuMoon /> : <LuSunMedium />}
        </Button>

        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => handleMobileMenu()}
          className={"min-md:hidden"}
        >
          {isMobileMenuOpen ? <LuX /> : <LuMenu />}
        </Button>
      </div>
    </nav>
  );
};

const NavLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <img src={reactLogo} alt="EasyBuy" className="w-8" />
      <h3 className="font-Inter font-bold text-xl text-zinc-950 dark:text-zinc-50">
        EasyBuy
      </h3>
    </div>
  );
};

export default Navbar;
