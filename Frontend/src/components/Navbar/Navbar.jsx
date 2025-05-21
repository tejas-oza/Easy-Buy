import React from "react";
import { NavLink } from "react-router";
import Button from "../ui/Button";
import { LuBox, LuMenu, LuSunMedium, LuUser, LuX } from "react-icons/lu";

const Navbar = ({
  handleNavbar,
  isNavbarOpen,
  authLinks,
  isAuthenticated,
  handleDarkMode,
}) => {
  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border-b border-b-zinc-200 dark:border-b-zinc-800 sticky top-0">
      <div className="flex items-center gap-2">
        <LuBox strokeWidth={3} size={20} className="dark:text-white" />
        <p className="font-lora font-bold dark:font-medium text-zinc-900 dark:text-white text-lg">
          EasyBuy
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* mobile menu */}

        {/* mobile navbar */}
        <div
          className={`absolute top-0 right-0 w-56 h-svh flex flex-col gap-2 px-5 py-3 bg-zinc-200/30 dark:bg-zinc-800/30 backdrop-blur-sm border-l border-l-zinc-200 dark:border-l-zinc-600 z-50 transform ${
            isNavbarOpen ? "translate-x-0" : "translate-x-100"
          } transition-transform duration-500 md:hidden`}
        >
          <div className="flex items-center justify-end mb-3">
            <Button
              variant={"outlined"}
              className={`px-1.5 py-1.5 rounded-sm md:hidden `}
              onClick={() => handleNavbar()}
            >
              <LuX size={19} />
            </Button>
          </div>

          {authLinks.map((link) => (
            <NavLink
              key={link?.id}
              to={link?.path}
              className={`font-inter font-medium text-base md:text-sm text-zinc-900 dark:text-zinc-50`}
            >
              {link?.label}
            </NavLink>
          ))}
        </div>

        {/* desktop navbar */}
        <div className="flex items-center gap-3 max-md:hidden">
          {authLinks.map((link) => (
            <NavLink
              key={link?.id}
              to={link?.path}
              className={`font-inter font-semibold text-sm text-zinc-600`}
            >
              {link?.label}
            </NavLink>
          ))}
        </div>

        {isAuthenticated && (
          <Button
            variant={"outlined"}
            className={`p-1.5 rounded-full flex items-center justify-center`}
          >
            <LuUser />
          </Button>
        )}

        <Button
          variant={"ghost"}
          className={`px-1.5 py-1.5 rounded-sm`}
          onClick={() => handleDarkMode()}
        >
          <LuSunMedium />
        </Button>

        <Button
          variant={"ghost"}
          className={`px-1.5 py-1.5 rounded-sm md:hidden`}
          onClick={() => handleNavbar()}
        >
          <LuMenu size={19} />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
