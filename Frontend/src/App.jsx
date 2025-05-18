import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { useSelector } from "react-redux";

const App = () => {
  const isDarkMode = useSelector((state) => state.global.isDarkMode);

  return (
    <section
      className={`w-full min-h-svh overflow-hidden flex flex-col ${
        isDarkMode && "dark"
      }`}
    >
      <Navbar />

      <main className="flex-1">Main content</main>

      <Footer />
    </section>
  );
};

export default App;
