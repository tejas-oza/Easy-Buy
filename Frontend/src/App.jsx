import { useSelector } from "react-redux";
import NavbarContainer from "./components/Navbar/NavbarContainer";
import Container from "./components/ui/Container";

function App() {
  const isDarkMode = useSelector((state) => state.global.isDarkMode);

  return (
    <>
      <Container
        as="header"
        className={`${isDarkMode && "dark"} dark:bg-zinc-950 `}
      >
        <NavbarContainer />
      </Container>
    </>
  );
}

export default App;
