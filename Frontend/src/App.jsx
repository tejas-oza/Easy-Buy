import { useSelector } from "react-redux";
import NavbarContainer from "./components/Navbar/NavbarContainer";

function App() {
  const isDarkMode = useSelector((state) => state.global.isDarkMode);

  return (
    <>
      <div
        className={`${isDarkMode && "dark"} w-[100vw] dark:text-neutral-50 `}
      >
        <NavbarContainer />
      </div>
    </>
  );
}

export default App;
