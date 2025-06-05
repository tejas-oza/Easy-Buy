import React from "react";
import { NavLink } from "react-router";
import Button from "../ui/Button";

import {
  LuBox,
  LuMenu,
  LuSearch,
  LuSunMedium,
  LuUser,
  LuX,
} from "react-icons/lu";

const Navbar = ({
  handleNavbar,
  isNavbarOpen,
  isAuthenticated,
  authLinks,
  handleDarkMode,
}) => {
  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border-b border-b-zinc-100 dark:border-b-zinc-800 sticky top-0">
      <div className="flex items-center gap-3">
        <h1 className="font-lora font-bold text-lg text-zinc-900 dark:text-zinc-50">
          EasyBuy
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* mobile menu */}
        <Button
          variant={"ghost"}
          onClick={() => handleNavbar()}
          className={`lg:hidden`}
        >
          <LuMenu />
        </Button>
        <div
          className={`absolute top-0 right-0 h-svh w-56 lg:hidden p-5 flex flex-col gap-3 bg-zinc-100 border-l border-l-zinc-200 dark:bg-zinc-800 transform transition duration-300 ${
            isNavbarOpen ? "translate-x-0" : "translate-x-100"
          }`}
        >
          <Button
            variant={"outlined"}
            onClick={() => handleNavbar()}
            className={`lg:hidden w-max absolute top-5 right-5`}
          >
            <LuX />
          </Button>
          {authLinks?.map((item) => (
            <NavLink
              key={item?.id}
              to={item?.path}
              className={`font-inter font-medium dark:font-normal text-base text-zinc-900 dark:text-zinc-50 w-max`}
            >
              {item?.label}
            </NavLink>
          ))}
        </div>

        {/* desktop menu */}
        <div className="flex items-center gap-3 max-lg:hidden">
          {authLinks?.map((item) => (
            <NavLink
              key={item?.id}
              to={item?.path}
              className={`font-inter font-medium dark:font-normal text-base text-zinc-900 dark:text-zinc-50`}
            >
              {item?.label}
            </NavLink>
          ))}
        </div>
        <Button variant={"ghost"} onClick={() => handleDarkMode()}>
          <LuSunMedium />
        </Button>

        {/* Profile menu */}
      </div>
    </nav>
  );
};

export default Navbar;
