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
  const user = useSelector((state) => state.auth.user);
  const isMobileMenuOpen = useSelector(
    (state) => state.global.isMobileMenuOpen
  );

  const getNavItems = () => {
    let BaseLinks = NAV_LINKS;
    let OtherNavLinks = isAuthenticated
      ? AUTHENTICATED_NAV_LINKS[user?.role]
      : UNAUTHENTICATED_NAV_LINKS;

    return [...BaseLinks, ...OtherNavLinks];
  };

  const navLinksItems = getNavItems();

  return (
    <>
      <div className="flex items-center gap-4 max-md:hidden">
        {navLinksItems.map((item) => (
          <NavItem key={item?.id} to={item?.path} text={item?.text} />
        ))}
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden w-40 p-5 border border-zinc-300 dark:border-zinc-700 rounded-sm flex flex-col gap-4 bg-zinc-100/30 dark:bg-zinc-800/30 backdrop-blur-lg absolute top-16 right-0 transform transition-transform z-50 ${
          isMobileMenuOpen ? "-translate-x-1.5" : "translate-x-full"
        }`}
      >
        {navLinksItems.map((item) => (
          <NavItem key={item?.id} to={item?.path} text={item?.text} />
        ))}
      </div>
    </>
  );
};

const NavItem = ({ to, text }) => {
  return (
    <>
      <NavLink
        className={
          "font-Inter font-medium text-sm text-zinc-950 dark:text-zinc-50"
        }
        to={to}
      >
        {text}
      </NavLink>
    </>
  );
};

export default NavbarMenu;
