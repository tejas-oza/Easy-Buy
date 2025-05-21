import React from "react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { authenticatedLinks, unAuthenticatedLinks } from "./navbar.data";
import { toggleDarkMode, toggleNavBar } from "../../store/features/globalSlice";

const NavbarContainer = () => {
  const user = useSelector((state) => state.auth.user);
  const isNavbarOpen = useSelector((state) => state.global.isNavbarOpen);
  const dispatch = useDispatch();
  const handleNavbar = () => {
    dispatch(toggleNavBar(!isNavbarOpen));
  };

  // darkmode toggle
  const isDarkMode = useSelector((state) => state.global.isDarkMode);

  const handleDarkMode = () => {
    dispatch(toggleDarkMode(!isDarkMode));
  };
  return (
    <Navbar
      authLinks={
        user !== null ? authenticatedLinks["customer"] : unAuthenticatedLinks
      }
      isAuthenticated={user !== null}
      handleNavbar={handleNavbar}
      isNavbarOpen={isNavbarOpen}
      handleDarkMode={handleDarkMode}
    />
  );
};

export default NavbarContainer;
