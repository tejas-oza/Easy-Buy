import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router";

import {
  AUTHENTICATED_NAV_LINKS,
  NAV_LINKS,
  UNAUTHENTICATED_NAV_LINKS,
} from "./navbar.constants.js";

const NavbarMenu = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth?.user?.role || "guest");
  const isMobileMenuOpen = useSelector(
    (state) => state.global.isMobileMenuOpen
  );

  const getLinks = () => {
    let baseLinks = NAV_LINKS;
    let authLinks = isAuthenticated
      ? AUTHENTICATED_NAV_LINKS[role] || []
      : UNAUTHENTICATED_NAV_LINKS;
    return [...baseLinks, ...authLinks];
  };

  const navLinks = getLinks();
  return (
    <>
      <div className="hidden md:flex gap-6 items-center">
        {navLinks.map((item) => (
          <NavLinkItem key={item.id} to={item.path} text={item.text} />
        ))}
      </div>

      <div
        className={`md:hidden fixed top-20 right-0 w-60 min-h-10 p-5 bg-neutral-100 dark:bg-neutral-800 transform transition-transform duration-300 z-50 
          ${isMobileMenuOpen ? "-translate-x-1.5" : "translate-x-full"} 
          flex flex-col space-y-4 border border-neutral-200 rounded-sm`}
      >
        {navLinks.map((item) => (
          <NavLinkItem key={item.id} to={item.path} text={item.text} />
        ))}
      </div>
    </>
  );
};

const NavLinkItem = ({ to, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `font-Inter font-medium text-md text-neutral-950 dark:text-neutral-100 ${
        isActive ? "text-blue-600" : ""
      }`
    }
  >
    {text}
  </NavLink>
);

export default NavbarMenu;
