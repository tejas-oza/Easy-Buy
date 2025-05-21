import React from "react";
import Footer from "./components/Footer/Footer";
import { useSelector } from "react-redux";
import NavbarContainer from "./components/Navbar/NavbarContainer";

const App = () => {
  const isDarkMode = useSelector((state) => state.global.isDarkMode);

  return (
    <section
      className={`relative w-full min-h-svh overflow-hidden flex flex-col ${
        isDarkMode && "dark"
      }`}
    >
      <NavbarContainer />

      <main className="flex-1 dark:bg-zinc-900">Main content</main>

      <Footer />
    </section>
  );
};

export default App;
