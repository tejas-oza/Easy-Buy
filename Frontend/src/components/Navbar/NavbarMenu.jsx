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
      {/* Desktop */}
      <div className="hidden md:flex gap-6 items-center">
        {navLinks.map((item) => (
          <NavLinkItem key={item.id} to={item.path} text={item.text} />
        ))}
      </div>

      {/* Mobile */}
      <div
        className={`md:hidden fixed top-16 right-0 w-60 p-5 flex flex-col space-y-4 rounded-md bg-zinc-100/30 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md transform transition-transform duration-300 z-50 ${
          isMobileMenuOpen ? "-translate-x-1.5" : "translate-x-full"
        }`}
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
      `font-Inter font-medium text-md text-zinc-950 dark:text-zinc-50 ${
        isActive ? "text-blue-600" : ""
      }`
    }
  >
    {text}
  </NavLink>
);

export default NavbarMenu;
