import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

const App = () => {
  return (
    <section className="w-full min-h-svh overflow-hidden flex flex-col">
      <Navbar />

      <main className="flex-1">Main content</main>

      <Footer />
    </section>
  );
};

export default App;
