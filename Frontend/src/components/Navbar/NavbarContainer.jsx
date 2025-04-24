import React from "react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleDarkMode,
  toggleMobileMenu,
} from "../../store/features/globalSlice/globalSlice";

const NavbarContainer = () => {
  const dispatch = useDispatch();

  // toggle dark mode
  const isDarkMode = useSelector((state) => state.global.isDarkMode);

  const handleDarkMode = () => {
    dispatch(toggleDarkMode(!isDarkMode));
  };

  // toggle mobile menu
  const isMobileMenuOpen = useSelector(
    (state) => state.global.isMobileMenuOpen
  );

  const handleMobileMenu = () => {
    dispatch(toggleMobileMenu(!isMobileMenuOpen));
  };

  return (
    <Navbar
      handleDarkMode={handleDarkMode}
      isDarkMode={isDarkMode}
      handleMobileMenu={handleMobileMenu}
      isMobileMenuOpen={isMobileMenuOpen}
    />
  );
};

export default NavbarContainer;
