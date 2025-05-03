import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router";
import NavbarContainer from "./components/Navbar/NavbarContainer";
import AuthPage from "./pages/AuthPage/AuthPage";

function App() {
  const isDarkMode = useSelector((state) => state.global.isDarkMode);

  return (
    <>
      <section
        className={`relative max-w-svw min-h-svh overflow-hidden bg-zinc-50 dark:bg-zinc-900 ${
          isDarkMode && "dark"
        }`}
      >
        <NavbarContainer />

        <Routes>
          <Route path="/register" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
        </Routes>
      </section>
    </>
  );
}

export default App;
