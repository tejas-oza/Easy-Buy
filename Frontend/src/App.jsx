import { useSelector } from "react-redux";
import { Route, Routes } from "react-router";
import NavbarContainer from "./components/Navbar/NavbarContainer";
import AuthPage from "./pages/AuthPage/AuthPage";

function App() {
  const isDarkMode = useSelector((state) => state.global.isDarkMode);

  return (
    <>
      <section className={`${isDarkMode && "dark"} relative`}>
        <NavbarContainer />

        <Routes>
          <Route path="/register" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage type={true} />} />
        </Routes>
      </section>
    </>
  );
}

export default App;
